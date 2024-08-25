const express = require("express");
const router = express.Router();
const {verifyTokenAndAdmin} = require("../middlewares/verifyToken");
const { getAuthors } = require("../controllers/authorController");
const {getAuthors,
      getAuthorByID,
      createAuthor,
      updateAuthor,
      deleteAuthor} = require("../controllers/authorController")


router.get("/", getAuthors)
      .post(verifyTokenAndAdmin, createAuthor);

router.get("/:id/", getAuthorByID)
      .put(verifyTokenAndAdmin, updateAuthor)
      .delete(verifyTokenAndAdmin, deleteAuthor);

module.exports = router;
