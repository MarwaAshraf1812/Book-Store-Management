const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {User, validateUpdateUser} = require("../models/User");

/**
 * @desc Update User
 * @route /api/auth/register
 * @method PUT
 * @Access private
 */

const updateUser = asyncHandler(
    async (req, res) => {
        const {error} = validateUpdateUser(req.body);
        if(error) return res.status(400).json({message: error.details[0].message});

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
            }
        }, {new: true}).select("-password");

        res.status(200).json(updatedUser);
    }
);

/**
 * @desc Get all users
 * @route /api/auth/
 * @method GET
 * @Access private (only admin)
 */
const getUsers = asyncHandler(
    async (req, res) => {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    }
);

/**
 * @desc Get user by id
 * @route /api/auth/:id/
 * @method GET
 * @Access private (only admin and himself)
 */
const getUserById =  asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.params.id).select("-password");
        if(user) {
            res.status(200).json(user);
        } else{
            res.status(404).json({message: "User not found"});
        }
    }
);

/**
 * @desc delete user by id
 * @route /api/auth/:id/
 * @method DELETE
 * @Access private (only admin and himself)
 */
const deleteUser = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.params.id)
        if(user) {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({message: "User has been deleted"});
        } else{
            res.status(404).json({message: "User not found"});
        }
    }
);

module.exports = {
    updateUser,
    getUsers,
    getUserById,
    deleteUser
}