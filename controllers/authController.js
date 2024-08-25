const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {User, validateLoginUser, validateRegisterUser} = require("../models/User");


/**
 * @desc Register new user
 * @route /api/auth/register
 * @method POST
 * @ACCESS public
 */
const regisreUser = asyncHandler(
    async (req,res) => {
        const {error} = validateRegisterUser(req.body);
        if(error) return res.status(400).json({message: error.details[0].message});

        let user = await User.findOne({email: req.body.email});
        if(user) return res.status(400).json({message: "User already registered"});
        
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        user = new User({
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
        })

        const result = await user.save();
        const token = user.generateToken();
        
        const {password, ...other} = result._doc;
        res.status(201).json({...other, token});
    }
);

/**
 * @desc Login user
 * @route /api/auth/login
 * @method POST
 * @ACCESS public
 */
const loginUser =  asyncHandler(
    async (req,res) => {
        const {error} = validateLoginUser(req.body);
        if(error) return res.status(400).json({message: error.details[0].message});

        let user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).json({message: "Invalid email or password"});
        
        const isPassword = await bcrypt.compare(req.body.password, user.password);
        if(!isPassword) return res.status(400).json({message: "Invalid password or password"});

        
        const token = user.generateToken();
        
        const {password, ...other} = user._doc;
        res.status(200).json({...other, token});
    }
);

module.exports = {
    regisreUser,
    loginUser
};