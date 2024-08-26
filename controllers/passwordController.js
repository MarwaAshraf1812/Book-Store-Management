const asyncHandler = require("express-async-handler");
const { User } = require('../models/User'); // Ensure the correct import
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

/**
 * @desc Forgot password view
 * @route GET /password/forgot-password
 * @Access Public
 */
module.exports.getForgotPassword = asyncHandler(async (req, res) => {
    res.render("forget-password");
});

/**
 * @desc Send forgot password link
 * @route POST /password/forgot-password
 * @Access Public
 */
module.exports.sendForgotPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const newSecretKey = process.env.JWT_SECRET_KEY + user.password;
    const resetToken = jwt.sign({ id: user._id, email: user.email }, newSecretKey, {
        expiresIn: "10m",
    });

    const resetPasswordLink = `${req.protocol}://${req.get("host")}/password/reset-password/${user._id}/${resetToken}`;

    // Send email
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Reset Password",
        text: `Click on the link to reset your password: ${resetPasswordLink}`,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500);
            throw new Error("Email could not be sent");
        }
        console.log("Email sent: " + info.response);
    })


    res.status(200).json({ message: "Password reset link sent", resetPasswordLink });
});

/**
 * @desc Get reset password page
 * @route GET /password/reset-password/:userId/:token
 * @Access Public
 */
module.exports.getResetPassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const newSecretKey = process.env.JWT_SECRET_KEY + user.password;
    try {
        jwt.verify(req.params.token, newSecretKey);
        res.render("reset-password", { email: user.email });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Invalid or expired token" });
    }
});

/**
 * @desc Reset password
 * @route POST /password/reset-password/:userId/:token
 * @Access Public
 */
module.exports.updatePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const newSecretKey = process.env.JWT_SECRET_KEY + user.password;
    try {
        jwt.verify(req.params.token, newSecretKey);

        // Hash new password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        await user.save();

        res.render(success-password);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Invalid or expired token" });
    }
});
