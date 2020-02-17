"use strict";

/**
 * Module dependencies.
 */

// const home = require("../app/routes/home");
const user = require("../app/user/user.route");
const resetPassword = require("../app/resetPassword/resetPassword.route");
const express = require("express");
const router = express.Router();

router.use("/users", user);
router.use("/", resetPassword);
module.exports = router;
