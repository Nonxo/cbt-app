const User = require("./user.model");
const email = process.env.MAILER_EMAIL_ID;
const pass = process.env.MAILER_PASS;
const nodemailer = require("nodemailer");
const handleBars = require("nodemailer-express-handlebars");
const path = require("path");

const smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || "Gmail",
  auth: email,
  pass: pass
});

const handleBarsOption = {
  viewEngine: "handlebars",
  viewPath: path.resolve("../views/"),
  extName: ".html"
};

smtpTransport.use("compile", handleBars(handleBarsOption));
exports.registerUser = async function(data) {
  try {
    const newUser = new User({
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      dateOfBirth: data.dateOfBirth,
      email: data.email,
      password: data.password
    });
    const validUser = await User.exists({
      email: data.email
    });
    if (validUser) {
      return {
        error: true,
        msg: "User email already exist"
      };
    }

    newUser.setPassword(data.password);
    newUser.generateJWT();
    const user = await newUser.save();
    console.log(user);
    const { firstName } = user;
    return {
      error: false,
      message: `${firstName} successfully created`
    };
  } catch (error) {
    throw new Error(error);
  }
};

exports.authenticate = async function(data) {
  try {
    const newUser = new User({
      email: data.email,
      password: data.password
    });
    const validUser = await User.findOne({ email: data.email });
    if (!validUser) {
      return {
        error: true,
        msg: "Invalid Credentials. Please check your email and password"
      };
    }
    const { password, salt } = validUser;
    const matchedPassword = await newUser.comparePassword(
      data.password,
      salt,
      password
    );
    if (!matchedPassword) {
      return {
        error: true,
        msg: "Invalid Credentials. Please check your email and password"
      };
    }
    const { firstName, lastName, email } = validUser;
    const UserDetails = { firstName, lastName, email };
    return {
      error: false,
      UserDetails
    };
  } catch (error) {
    throw new Error(error);
  }
};

exports.forgotPassword = async function(data) {
  try {
    const registeredUser = new User({
      email: data.email
    });
    const validEmail = await User.findOne({
      email: data.email
    });
    const { _id, email: userEmail, firstName, lastName } = validEmail;
    if (!validEmail) {
      return {
        error: true,
        msg: "User not found"
      };
    }
    User.findOneAndUpdate({ _id }, { token });
    const token = registeredUser.generateJWT();

    let forgotPasswordDetails = {
      to: userEmail,
      from: email,
      template: "Forgot Password Email",
      subject: "Password reset has arrived",
      context: {
        url: "http://localhost:3000/auth/reset_password?token=" + token,
        name: `${firstName} ${lastName}`
      }
    };
    smtpTransport.sendMail(forgotPasswordDetails, function(err) {
      if (!err) {
        return {
          error: false,
          msg: "Kindly check your email for further instructions "
        };
      }
      return {
        error: true,
        msg: err.message
      };
    });
  } catch (error) {
    throw new Error(error);
  }
};

exports.resetPassword = async function(data) {
  try {
    const validUser = await User.findOne({
      token: data.token
    });
    if (validUser) {
      if (data.newPassword === data.verifyPassword) {
        validUser.setPassword(data.password);
      } else
        return {
          error: true,
          msg: "Password does not match"
        };
    }
    const user = validUser.save();
    const { firstName, email: userEmail, lastName } = user;
    const resetData = {
      to: userEmail,
      from: email,
      template: "Reset Password email",
      subject: "Password Reset Confirmation",
      context: {
        name: `${firstName} ${lastName}`
      }
    };

    smtpTransport.sendMail(resetData, function(err) {
      if (!err) {
        return {
          error: false,
          msg: "Password Reset"
        };
      } else
        return {
          error: true,
          msg: "Password does not match"
        };
    });
  } catch (error) {
    throw new Error(error);
  }
};
