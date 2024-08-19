const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {User, validateUpdateUser} = require("../models/User");
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("../middlewares/verifyToken");


/**
 * @desc Update User
 * @route /api/auth/register
 * @method PUT
 * @Access private
 */
router.put("/:id", verifyTokenAndAuthorization, asyncHandler(
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
))

/**
 * @desc Get all users
 * @route /api/auth/register
 * @method GET
 * @Access private (only admin)
 */
router.get("/", verifyTokenAndAdmin, asyncHandler(
    async (req, res) => {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    }
))

module.exports = router;
