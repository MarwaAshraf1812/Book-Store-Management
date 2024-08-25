const express = require("express");
const router = express.Router();
const {verifyTokenAndAdmin} = require("../middlewares/verifyToken")
const {getAllBooks, createBook, getBookByID, updateBook, deleteBook} = require("../controllers/bookController")


router.get("/", getAllBooks)
      .post(verifyTokenAndAdmin, createBook);

router.get("/:id", getBookByID)
      .put(verifyTokenAndAdmin, updateBook )
      .delete(verifyTokenAndAdmin, deleteBook);

module.exports = router;
