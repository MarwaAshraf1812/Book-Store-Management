const express = require("express");
const router = express.Router();
const {regisreUser, loginUser} = require("../controllers/authController")


router.post("/register", regisreUser);

router.post("/login", loginUser);

module.exports = router;
