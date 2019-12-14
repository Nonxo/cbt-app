const User = require("../models/user");

exports.registerUser = async function(data) {
  try {
    const newUser = new User({
      name: data.name,
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
    return {
      error: false,
      user
    };
  } catch (error) {
    throw new Error(error);
  }
};
