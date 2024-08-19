const mongoose = require("mongoose");
const joi = require('joi');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 250,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 250,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    cover: {
        type: String,
        required: true,
        enum: ["soft cover", "hard cover"],
    },
}, {
    timestamps: true
});

function validateCreateBook(book) {
    const schema = joi.object({
        title: joi.string().trim().min(3).max(250).required(),
        description: joi.string().trim().min(5).required(),
        author: joi.string().required(),
        price: joi.number().min(0).required(),
        cover: joi.string().valid("soft cover", "hard cover").required(),
    });
    return schema.validate(book);
}

function validateUpdateBook(book) {
    const schema = joi.object({
        title: joi.string().trim().min(3).max(250),
        description: joi.string().min(5),
        author: joi.string(),
        price: joi.number().min(0),
        cover: joi.string().valid("soft cover", "hard cover"),
    });
    return schema.validate(book);
}

const Book = mongoose.model("Book", BookSchema);

module.exports = {
    Book,
    validateCreateBook,
    validateUpdateBook,
};
