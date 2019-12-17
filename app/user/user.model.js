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

let UserSchema = new Schema({
  _id: { type: String, default: uuid4 },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  phoneNumber: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String },
  token: { type: String }
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
  console.log(this.salt);
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

mongoose.model("User", UserSchema);
module.exports = mongoose.model("User");