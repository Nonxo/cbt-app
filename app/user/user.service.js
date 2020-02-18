const User = require("./user.model");
const PasswordResetToken = require("../resetPassword/resetPassword.model");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
// const handleBars = require("nodemailer-express-handlebars");
// const path = require("path");

require("dotenv").config();
const email = process.env.MAILER_EMAIL_ID;
const pass = process.env.MAILER_PASS;
const smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: email,
    pass
  }
});

exports.registerUser = async function(data) {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      email,
      password,
      secretKey
    } = data;
    const newUser = new User({
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      email,
      password
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

    newUser.setPassword(password);
    newUser.setRoles(secretKey);
    newUser.generateAuthToken();
    const user = await newUser.save();
    console.log(user);
    // const { firstName } = user;
    return {
      error: false,
      message: `${firstName} successfully created`,
      user: newUser.toAuthJSON()
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
    // const registeredUser = new User({
    //   email: data
    // });
    // console.log(registeredUser);
    // console.log(data);
    const validEmail = await User.findOne({
      email: data
    });
    const { _id, email: userEmail } = validEmail;
    console.log("We are valid also" + validEmail);
    // const token = registeredUser.generateJWT();
    const token = new PasswordResetToken({
      userId: _id,
      resetToken: crypto.randomBytes(16).toString("hex")
    });
    console.log(token, "We are coming");
    await token.save();
    if (!validEmail) {
      return {
        error: true,
        msg: "User not found"
      };
    }
    // await User.findOneAndUpdate(
    //   { _id },
    //   {
    //     resetPasswordToken: token,
    //     resetPasswordExpires: Date.now() + 3600000
    //   }
    // );
    // await User.findOneAndUpdate({ _id }, { token });
    let smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: email,
        pass
      }
    });

    let forgotPasswordDetails = {
      to: userEmail,
      from: email,
      text:
        "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
        "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
        `http://localhost:3000/auth/reset_password?token=${token}\n\n` +
        "If you did not request this, please ignore this email and your password will remain unchanged.\n",
      subject: "Link to Reset Password"
      // context: {
      //   url: "http://localhost:3000/auth/reset_password?token=" + token,
      //   name: `${firstName} ${lastName}`
      // }
    };
    let info = await smtpTransport.sendMail(forgotPasswordDetails, function(
      err,
      response
    ) {
      if (err) {
        console.log(err);
        return {
          error: true,
          msg: err
        };
      } else {
        console.log("Here is the response", response);
        return {
          error: false,
          msg: "Kindly check your email for further instructions ",
          response
        };
      }
    });
    console.log("My info", info);
    return {
      error: false,
      message: "Success"
    };
  } catch (error) {
    throw new Error(error);
  }
};

exports.resetPassword = async function(data, value) {
  try {
    console.log(data, "We are together again");
    const { token } = data;
    const { password } = value;
    const validUser = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: Date.now()
      }
    });
    console.log(validUser);
    const { _id, firstName, email: userEmail, lastName } = validUser;
    if (validUser == null) {
      console.log("Password reset is null");
      return {
        error: true,
        message: `Password reset link is invalid or has expired`
      };
    }
    console.log(validUser.setPassword(password), "Like a mighty Ocean");
    await User.findOneAndUpdate(
      { _id },
      {
        password: validUser.setPassword(password),
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    );

    const resetData = {
      to: userEmail,
      from: email,
      template: "Reset Password email",
      subject: "Password Reset Confirmation",
      context: {
        name: `${firstName} ${lastName}`
      },
      text: "You password have just been updated"
    };
    let info = await smtpTransport.sendMail(resetData, function(err, response) {
      if (!err) {
        return {
          error: false,
          msg: "Password Reset",
          message: response
        };
      } else
        return {
          error: true,
          msg: "Password does not match"
        };
    });
    console.log("MyInfo", info);
    return {
      error: false,
      message: `Password reset link is Confirmed`
    };
  } catch (error) {
    throw new Error(error);
  }
};
