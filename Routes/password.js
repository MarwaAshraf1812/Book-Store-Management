const express = require("express");
const {
    getForgotPassword,
    sendForgotPassword,
    getResetPassword,
    updatePassword
} = require("../controllers/passwordController");
const router = express.Router();

// /password/forgot-password
router
    .route("/forgot-password")
    .get(getForgotPassword)
    .post(sendForgotPassword);

// /password/reset-password/:userId/:token
router.route("/reset-password/:userId/:token")
    .get(getResetPassword)
    .post(updatePassword);

module.exports = router;
