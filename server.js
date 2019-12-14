"use strict";

/*
 * nodejs-express-mongoose
 * Copyright(c) 2015 Madhusudhan Srinivasa <madhums8@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

require("dotenv").config();

const fs = require("fs");
const join = require("path").join;
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const config = require("./config/env/development");
const router = require("./config/routes");

const models = join(__dirname, "app/models");
// const port = process.env.PORT || 3000;

const app = express();
const connection = connect();

/**
 * Expose
 */

module.exports = {
  app,
  connection
};

// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.indexOf(".js"))
  .forEach(file => require(join(models, file)));

// Bootstrap routes
require("./config/passport")(passport);
require("./config/express")(app, passport);
// require("./config/routes")(router, passport);

app.use("/", router);
connection.on("error", console.log).once("open", listen);

//  .on("disconnected", connect)
function listen() {
  if (app.get("env") === "test") return;
  app.listen(config.PORT);
  console.log(`Express app started on port${config.PORT}`);
}

function connect() {
  var options = {
    // keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  };
  mongoose
    .connect(config.DB_HOST, options, () => {
      console.log("We are connected");
    })
    .catch(err => console.log(err));
  return mongoose.connection;
}
