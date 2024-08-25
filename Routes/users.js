const express = require("express");
const router = express.Router();
const {updateUser, getUsers, getUserById, deleteUser} = require("../controllers/userController")
const {verifyTokenAndAuthorization,
      verifyTokenAndAdmin} = require("../middlewares/verifyToken");


router.get("/", verifyTokenAndAdmin, getUsers);

router.put("/:id", verifyTokenAndAuthorization, updateUser)
      .get(verifyTokenAndAuthorization, getUserById)
      .delete(verifyTokenAndAuthorization, deleteUser);

module.exports = router;
