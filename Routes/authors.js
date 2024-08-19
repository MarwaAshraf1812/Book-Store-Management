const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {Author, validateCreateAuthor, validateUpdateAuthor} = require("../models/Author");

/**
 * @desc Get all authors
 * @route /api/authors
 * @method GET
 * @ACCESS public
 */
router.get("/", asyncHandler(
    async (req, res) => {
        const authors = await Author.find();
        res.json(authors);
    }
));

/**
 * @desc Get an author by id
 * @route /api/authors/:id
 * @method GET
 * @ACCESS public
 */
router.get("/:id", asyncHandler(
    async(req, res) => {
    const author = await Author.findById(req.params.id)

    if (author) {
        res.json(author);
    } else {
        res.status(404).send("Author not found");
    }
}));

/**
 * @desc Create a new author
 * @route /api/authors
 * @method POST
 * @ACCESS public
 */
router.post("/", asyncHandler(
    async (req, res) => {

        const { error } = validateCreateAuthor(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const author = new Author({
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            nationality: req.body.nationality,
            image: req.body.image,
            bio: req.body.bio
        });
        
        const result = await author.save();
        return res.status(201).json({message: `${result.FirstName} added`, author: result});
    }
));


/**
 * @desc Update an author
 * @route /api/authors/:id
 * @method PUT
 * @ACCESS public
 */
router.put("/:id", asyncHandler(
    async (req, res) => {

    const {error} = validateUpdateAuthor(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const author = await Author.findByIdAndUpdate(req.params.id, {
        $set:{
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            nationality: req.body.nationality,
            image: req.body.image,
            bio: req.body.bio
        }});
    if (!author) {
        return res.status(404).send("Author not found");
    }})
);

/**
 * @desc Delete an author
 * @route /api/authors/:id
 * @method DELETE
 * @ACCESS public
 */
router.delete("/:id/", asyncHandler(
    async (req, res) => {
        const author = await Author.findById(req.params.id);

        // Check if the author exists
        if (author) {
            await Author.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "Author has been deleted" });
        } else {
            return res.status(404).send("Author not found");
        }
    }
));

module.exports = router;
