const ResetPasswordService = require("./resetPassword.service");

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (email === "") {
      res.status(400).json({
        success: false,
        message: "email is required"
      });
    }
    const data = await ResetPasswordService.forgotPassword(email);
    if (data.error) {
      res.status(200).json({
        success: false,
        message: data.msg
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
