const User = require("./user.model");

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
