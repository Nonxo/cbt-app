const UserService = require("./user.service");

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
    const data = await UserService.registerUser(value);

    if (data.error) {
      return res.status(400).json({
        success: false,
        message: data.error.message
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
