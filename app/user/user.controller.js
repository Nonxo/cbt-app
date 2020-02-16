const {
  registerUser,
  resetPassword,
  authenticate,
  forgotPassword
} = require("./user.service");
const path = require("path");
const url = require("url");
exports.registerUser = async (req, res) => {
  try {
    const value = req.body;
    const data = await registerUser(value);
    console.log(data);
    if (data.error) {
      return res.status(200).json({
        success: false,
        message: data.msg
      });
    }

    return res.status(201).json({
      success: true,
      message: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.authenticate = async (req, res) => {
  try {
    const value = req.body;
    const data = await authenticate(value);

    if (data.error) {
      return res.status(400).json({
        success: false,
        message: data.msg
      });
    }

    return res.status(201).json({
      success: true,
      message: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const value = req.body.email;

    if (!req.body.email) {
      res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
    const data = await forgotPassword(value);
    console.log(data);
    if (data.error) {
      console.log(data.error);
      return res.status(409).json({
        success: false,
        message: data.error
      });
    }
    return res.status(200).json({
      success: true,
      message: data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const queryObject = url.parse(req.url, true).query;
    const value = req.body;
    const data = await resetPassword(queryObject, value);
    if (data.error) {
      console.log(data.error);
      return res.status(403).json({
        success: false,
        message: data.error
      });
    }
    return res.status(200).json({
      success: true,
      message: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error
    });
  }
};

exports.index = function(req, res) {
  return res.sendFile(path.resolve("app/views/home/index.html"));
};

exports.renderForgotPasswordTemplate = function(req, res) {
  return res.sendFile(path.resolve("app/views/home/forgot-password.html"));
  // return res.sendFile(path.resolve("../views/home/forgot-password.html"));
};

exports.renderResetPasswordTemplate = function(req, res) {
  return res.sendFile(path.resolve("app/views/home/reset-password.html"));
};
