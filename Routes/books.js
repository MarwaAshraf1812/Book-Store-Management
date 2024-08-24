const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {verifyTokenAndAdmin} = require("../middlewares/verifyToken")
const {Book, validateCreateBook, validateUpdateBook} = require("../models/Book");

/**
 * @desc Get all books with optional filtering
 * @route GET /api/books
 * @Access Public
 */
router.get("/", asyncHandler(async (req, res) => {
    const { maxPrice, minPrice, title, author, cover } = req.query;
    let filter = {};

    // Add filters based on query parameters
    if (maxPrice) filter.price = { ...filter.price, $lt: Number(maxPrice) };
    if (minPrice) filter.price = { ...filter.price, $gt: Number(minPrice) };
    if (title) filter.title = { $regex: title, $options: "i" }; // Case-insensitive search for title
    if (author) filter.author = author;
    if (cover) filter.cover = cover;

    // Fetch filtered books from the database and populate the author field
    const filteredBooks = await Book.find(filter).populate("author", ["_id", "FirstName", "LastName"]);

    res.status(200).json(filteredBooks);
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
 * @ACCESS private (only admin)
 */
router.post("/", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
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
 * @ACCESS private (only admin)
 */
router.put("/:id", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
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
 * @ACCESS private (only admin)
 */
router.delete("/:id", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (deletedBook) {
        res.json({ message: "Book deleted", book: deletedBook });
    } else {
        res.status(404).send("Book not found");
    }
}));

module.exports = router;
