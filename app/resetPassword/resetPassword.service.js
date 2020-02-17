const User = require("../user/user.model");
const nodemailer = require("nodemailer");
const PasswordResetToken = require("./resetPassword.model");
const crypto = require("crypto");
require("dotenv").config();
const email = process.env.MAILER_EMAIL_ID;
const pass = process.env.MAILER_PASS;

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
