const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

router.post("/", UserController.registerUser);

module.exports = router;
