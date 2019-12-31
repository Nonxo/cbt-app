const express = require("express");
const router = express.Router();
const UserController = require("./user.controller");

const { registerUser, authenticate } = UserController;

router.post("/", registerUser);
router.post("/login", authenticate);

module.exports = router;
