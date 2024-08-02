const User = require("../../model/User");
const bcrypt = require("bcryptjs");
const AppErr = require("../../utils/AppErr");
const generateToken = require("../../utils/generateToken");

// Register
const registerUserCtrl = async (req, res, next) => {
  try {
    // check if email exist
    const userFound = await User.findOne({ email: req.body.email });
    if (userFound) {
      return next(new AppErr("User Already Exist.", 400));
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // update with the hashed password
    req.body.password = hashedPassword;

    // Create User
    const user = await User.create(req.body);
    res.json({
      status: "success",
      fullname: user.fullname,
      email: user.email,
      id: user._id,
    });
  } catch (error) {
    return next(new AppErr(error, 500));
  }
};

// Login
const userLoginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return next(new AppErr("All fields are compulsory.", 400));
    }
    // check if email exist
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return next(new AppErr("Invalid Login Credentials", 400));
    }

    // check for password validity
    const isPasswordMatch = await bcrypt.compare(password, userFound.password);
    if (!isPasswordMatch) {
      return next(new AppErr("Invalid Login Credentials", 400));
    }

    res.json({
      status: "success",
      fullname: userFound.fullname,
      id: userFound._id,
      token: generateToken(userFound._id),
    });
  } catch (error) {
    return next(new AppErr(error, 500));
  }
};

// Profile
const userProfileCtrl = async (req, res, next) => {
  try {
    const user = await User.findById(req.user).populate({
      path: "accounts",
      populate: {
        path: "transactions",
        model: "Transaction",
      },
    });
    res.json(user);
  } catch (error) {
    next(new AppErr(error, 500));
  }
};

// Delete
const deleteUserCtrl = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user);
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(new AppErr(error, 500));
  }
};

// Update
const updateUserCtrl = async (req, res, next) => {
  try {
    // check if email exists
    const userFound = await User.findOne({ email: req.body.email });
    if (userFound)
      return next(
        new AppErr("Email is taken or you already have this email", 400)
      );

    const user = await User.findByIdAndUpdate(req.user, req.body, {
      new: true,
      runValidators: true,
    });

    // Check if user is updating the password
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      // update the password
      const user = await User.findByIdAndUpdate(
        req.user,
        {
          password: hashedPassword,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      // send the response
      return res.status(200).json({
        status: "success",
        data: user,
      });
    }

    // send the response
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(new AppErr(error, 500));
  }
};

module.exports = {
  registerUserCtrl,
  userLoginCtrl,
  userProfileCtrl,
  deleteUserCtrl,
  updateUserCtrl,
};
