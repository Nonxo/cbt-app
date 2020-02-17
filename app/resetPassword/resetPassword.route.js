const express = require("express");
const router = express.Router();
const {
  resetPassword,
  forgotPassword,
  validateToken
} = require("./resetPassword.controller");

router.route("/forgot_password").post(forgotPassword);
router.route("/reset").post(validateToken, resetPassword);
module.exports = router;
