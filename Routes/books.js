const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {Book, validateCreateBook, validateUpdateBook} = require("../models/Book");

/**
 * @desc Get all books
 * @route /api/books
 * @method GET
 * @ACCESS public
 */
router.get("/", asyncHandler(async (req, res) => {
    const books = await Book.find().populate("author", ["_id","FirstName","LastName"]);
    res.json(books);
}));

/**
 * @desc Get book by id
 * @route /api/books/:id
 * @method GET
 * @ACCESS public
 */
router.get("/:id", asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id).populate("author", ["_id","FirstName","LastName"]);
    if (book) 
        res.json(book);
    else 
        res.status(404).json({ message: "Book not found" });
}));

/**
 * @desc Add new book
 * @route /api/books/
 * @method POST
 * @ACCESS public
 */
router.post("/", asyncHandler(async (req, res) => {
    const { error } = validateCreateBook(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        price: req.body.price,
        cover: req.body.cover,
    });

    const result = await book.save();
    return res.status(201).json({ message: `${result.title} added`, book: result });
}));

/**
 * @desc Update a book
 * @route /api/books/:id
 * @method PUT
 * @ACCESS public
 */
router.put("/:id", asyncHandler(async (req, res) => {
    const { error } = validateUpdateBook(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            price: req.body.price,
            cover: req.body.cover,
        }
    }, { new: true });

    if (updatedBook) {
        await updatedBook.save();
        res.json({ message: "Book updated", book: updatedBook });
    } else {
        res.status(404).send("Book not found");
    }
}));

/**
 * @desc Delete a book
 * @route /api/books/:id
 * @method DELETE
 * @ACCESS public
 */
router.delete("/:id", asyncHandler(async (req, res) => {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (deletedBook) {
        res.json({ message: "Book deleted", book: deletedBook });
    } else {
        res.status(404).send("Book not found");
    }
}));

module.exports = router;
