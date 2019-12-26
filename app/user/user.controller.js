const UserService = require("./user.service");
const path = require("path");

exports.registerUser = async (req, res) => {
  try {
    const value = req.body;
    const data = await UserService.registerUser(value);
    console.log(data);
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

exports.authenticate = async (req, res) => {
  try {
    const value = req.body;
    const data = await UserService.authenticate(value);

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
    const value = req.body;
    const data = await UserService.forgotPassword(value);
    if (data.error) {
      return res.status(422).json({
        success: true,
        message: data.message
      });
    }
    return res.status(200).json({
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

exports.index = function(req, res) {
  return res.sendFile("../views/home/index.html");
};

exports.renderForgotPasswordTemplate = function(req, res) {
  return res.sendFile(path.resolve("../views/home/forgot-password.html"));
};

exports.renderResetPasswordTemplate = function(req, res) {
  return res.sendFile(path.resolve("../views/home/reset-password.html"));
};
