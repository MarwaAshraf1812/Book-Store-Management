const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const joi = require('joi');
const passwordComplexity = require("joi-password-complexity");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 5,
        maxlength: 100,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

function validateRegisterUser(user) {
    const schema = joi.object({
        email: joi.string().trim().min(5).max(100).required().email(),
        username: joi.string().trim().min(3).max(200).required(),
        password: passwordComplexity().required(),
    });
    return schema.validate(user);
}

function validateUpdateUser(user) {
    const schema = joi.object({
        email: joi.string().trim().min(5).max(100).email(),
        username: joi.string().trim().min(3).max(200),
        password: joi.string().trim().min(8),
    });
    return schema.validate(user);
}

function validateLoginUser(user) {
    const schema = joi.object({
        email: joi.string().trim().min(5).max(200).email(),
        password: joi.string().trim().min(8),
    });
    return schema.validate(user);
}

function validateChangePassword(user) {
    const schema = joi.object({
        email: joi.string().trim().min(5).max(200).email().required(),
        password: joi.string().trim().min(8),
    });
    return schema.validate(user);
}

UserSchema.methods.generateToken = function () {
    return jwt.sign({
        id: this._id,
        username: this.username,
        isAdmin: this.isAdmin
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: "4d"
    });
};

const User = mongoose.model("User", UserSchema);

module.exports = {
    User,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser,
    validateChangePassword
};
