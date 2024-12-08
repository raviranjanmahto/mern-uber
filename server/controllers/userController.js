const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.signup = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !email || !password)
    return next(new AppError("All fields are required", 400));

  const user = await User.create({ firstName, lastName, email, password });

  // Generate a JWT for the newly created user
  const token = user.generateToken();

  res.status(201).json({ status: true, token, user });
});
