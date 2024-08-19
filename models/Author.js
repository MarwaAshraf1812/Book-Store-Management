const mongoose = require("mongoose");
const joi = require('joi');

const AuthorSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200,
    },
    LastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200,
    },
    nationality: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    image: {
        type: String,
        default: "default-avatar.png"
    },
    bio: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 300,
    }
}, {
    timestamps: true
});

function validateUpdateAuthor(author) {
    const schema = joi.object({
        FirstName: joi.string().min(3),
        LastName: joi.string().min(3),
        nationality: joi.string(),
        image: joi.string(),
        bio: joi.string().min(3).max(300),
    });
    return schema.validate(author);
}

function validateCreateAuthor(author) {
    const schema = joi.object({
        FirstName: joi.string().min(3).max(200).required(),
        LastName: joi.string().min(3).max(200).required(),
        nationality: joi.string().min(2).max(100).required(),
        image: joi.string().required(),
        bio: joi.string().min(3).max(300).required(),
    });
    return schema.validate(author);
}


const Author = mongoose.model("Author", AuthorSchema);

module.exports = {
    Author,
    validateCreateAuthor,
    validateUpdateAuthor
}
