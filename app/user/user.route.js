const express = require("express");
const router = express.Router();
const UserController = require("./user.controller");

const { registerUser, authenticate } = UserController;
router.get("/", function(req, res) {
  res.status(200).sendFile(__dirname + "/app/views/home/index.html");
});
router.post("/", registerUser);
router.post("/login", authenticate);

module.exports = router;
