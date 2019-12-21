"use strict";

/**
 * Module dependencies.
 */

// const home = require("../app/routes/home");
const user = require("../app/user/user.route");
const express = require("express");
const router = express.Router();

router.use("/users", user);
module.exports = router;
