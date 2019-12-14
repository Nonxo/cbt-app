/*!
 * Module dependencies
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const uuid4 = require("uuid/v4");

/**
 * User schema
 */

const UserSchema = new Schema({
  id: { type: String, default: uuid4 },
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  hashed_password: { type: String, default: "" },
  salt: { type: String, default: "" }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(Number(12)).toString("hex");
  return (this.password = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex"));
};

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);
  return (this.token = jwt.sign(
    {
      email: this.email,
      id: this._id,
      exp: parseInt((expirationDate.getTime() / 100).toString(), 10)
    },
    "secret"
  ));
};

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);
  return (this.token = jwt.sign(
    {
      email: this.email,
      id: this._id,
      exp: parseInt((expirationDate.getTime() / 100).toString(), 10)
    },
    "secret"
  ));
};

UserSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    salt: this.salt,
    token: this.token,
    password: this.setPassword(this.password)
  };
};
UserSchema.method({});

/**
 * Statics
 */

UserSchema.static({});

/**
 * Register
 */

module.exports = mongoose.model("User", UserSchema);
