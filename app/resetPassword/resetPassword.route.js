const express = require("express");
const router = express.Router();
const ResetPasswordController = require("./resetPassword.controller");

const { forgotPassword } = ResetPasswordController;
router.route("/forgot_password").post(forgotPassword);
