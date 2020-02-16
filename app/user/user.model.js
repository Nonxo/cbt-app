/*!
 * Module dependencies
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

/**
 * User schema
 */

let UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  isVerified: {
    type: Boolean,
    default: false
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function(type) {
        return type.match(
          /^((\+234)|0)([8]((0[2-9])|(1[0-9]))|([7,9]0[1-9]))[0-9]{7}$/
        );
      },
      message: `Phone number is invalid`
    },
    required: true
  },
  dateOfBirth: {
    type: Date,
    min: "1970-01-01",
    max: Date.now(),
    required: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true
  },
  password: { type: String, required: true },
  salt: { type: String },
  token: { type: String },
  secretKey: {
    type: String
  },
  role: {
    type: String,
    enum: ["Admin", "User"]
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
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

UserSchema.methods.comparePassword = function(password, salt, hashedPassword) {
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 512, "sha512")
    .toString("hex");
  return hashedPassword === hash;
};

UserSchema.methods.setRoles = function(secretKey) {
  if (secretKey === process.env.MYPRIVATEKEY) {
    return (this.role = "Admin");
  }
  return (this.role = "User");
};
UserSchema.methods.generateAuthToken = function() {
  const myPrivateKey = process.env.MYPRIVATEKEY;
  this.resetPasswordToken = null;
  this.resetPasswordExpires = null;
  const userToken = jwt.sign(
    {
      _id: this._id,
      role: this.role
    },
    myPrivateKey
  );
  return (this.token = userToken);
};

UserSchema.methods.generateJWT = function() {
  const token = crypto.randomBytes(20).toString("hex");
  console.log(token);
  return token;
  // const today = new Date();
  // const expirationDate = new Date(today);
  // expirationDate.setDate(today.getDate() + 60);
  // console.log(this.email);
  // return (this.token = jwt.sign(
  //   {
  //     email: this.email,
  //     id: this._id,
  //     exp: parseInt((expirationDate.getTime() / 100).toString(), 10)
  //   },
  //   "secret"
  // ));
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
