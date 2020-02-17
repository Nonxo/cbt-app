const {
  forgotPassword,
  // resetPassword,
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
    let data = await validateToken(queryObject);
    // eslint-disable-next-line require-atomic-updates
    res.locals.data = req.body;
    if (data.error) {
      console.log(data.error);
      return res.status(409).json({
        success: false,
        message: data.error
      });
    }
    // console.log(res.locals, "We are here o");
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
    res.locals.data = req.data;
    // let data;
    // // const value = req.body.email;
    // res.locals.data = data;
    console.log(req.body, "Stop looking further");
    return res.status(200).json({
      success: true,
      message: `It is done`
    });
    // if (!req.body.email) {
    //   res.status(400).json({
    //     success: false,
    //     message: "Email is required"
    //   });
    // }
    // const data = await forgotPassword(value);
    // console.log(data);
    // if (data.error) {
    //   console.log(data.error);
    //   return res.status(409).json({
    //     success: false,
    //     message: data.error
    //   });
    // }
    // return res.status(200).json({
    //   success: true,
    //   message: data
    // });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
};
