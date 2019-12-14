const express = require("express");
const router = express.Router();
const UserController = require("./user.controller");

router.post("/", UserController.registerUser);

module.exports = router;
