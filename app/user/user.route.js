const express = require("express");
const router = express.Router();
const UserController = require("./user.controller");

const {
  registerUser,
  authenticate,
  forgotPassword,
  resetPassword,
  renderForgotPasswordTemplate,
  renderResetPasswordTemplate,
  index
} = UserController;

router.route("/").post(registerUser);
router.route("/").get(index);
router.route("/login").post(authenticate);
router.route("/reset").put(resetPassword);
router
  .route("/auth/forgot_password")
  .get(renderForgotPasswordTemplate)
  .post(forgotPassword);

router.route("/auth/reset_password").get(renderResetPasswordTemplate);

module.exports = router;
