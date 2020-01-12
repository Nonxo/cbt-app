const User = require("./user.model");
const nodemailer = require("nodemailer");
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

// const handleBarsOption = {
//   viewEngine: {
//     extName: ".hbs",
//     partialsDir: path.resolve(__dirname + "app/views"),
//     layoutsDir: path.resolve(__dirname + "app/views"),
//     defaultLayout: path.resolve(__dirname + "app/views")
//   },
//   viewPath: path.resolve(__dirname + "app/views"),
//   extName: ".html"
// };

// smtpTransport.use("compile", handleBars(handleBarsOption));
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
      email: data
    });
    // console.log(registeredUser);
    // console.log(data);
    const validEmail = await User.findOne({
      email: data
    });

    // console.log("We are valid also" + validEmail);
    if (!validEmail) {
      return {
        error: true,
        msg: "User not found"
      };
    }
    const { _id, email: userEmail } = validEmail;
    const token = registeredUser.generateJWT();

    await User.findOneAndUpdate({ _id }, { token });
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

exports.validPasswordToken = async function(data) {
  try {
    let validToken = await User.findOne({
      where: {
        resetPasswordToken: data
      }
    });

    if (validToken == null) {
      cons
    }
  } catch (error) {}
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
