const {
  forgotPassword,
  resetPassword,
  validateToken
} = require("./resetPassword.service");
const url = require("url");

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

exports.validateToken = async (req, res, next) => {
  try {
    const queryObject = url.parse(req.url, true).query;
    if (!queryObject) {
      res.status(400).json({
        success: false,
        message: "Token is required"
      });
    }
    const data = await validateToken(queryObject);
    if (data.error) {
      console.log(data.error);
      return res.status(409).json({
        success: false,
        message: data.error
      });
    }
    // eslint-disable-next-line require-atomic-updates
    res.locals.data = data;
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const {
      data: { resetToken }
    } = res.locals;
    const { password } = req.body;
    const result = await resetPassword(resetToken, password);
    console.log(resetToken, "We are data");
    if (result.error) {
      console.log(result.error);
      return res.status(409).json({
        success: false,
        message: result.error
      });
    }
    return res.status(200).json({
      success: true,
      message: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
};
