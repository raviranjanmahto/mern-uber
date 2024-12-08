const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const cookieToken = require("../utils/cookieToken");
const sendResponse = require("../utils/sendResponse");

exports.signup = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !email || !password)
    return next(new AppError("All fields are required", 400));

  const user = await User.create({ firstName, lastName, email, password });

  cookieToken(user, 201, res, "User created successfully");
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Email and password are required", 400));

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password)))
    return next(new AppError("Invalid email or password", 401));

  cookieToken(user, 201, res, "User logged in successfully");
});

exports.profile = catchAsync(async (req, res, next) => {
  sendResponse(req.user, 200, res, "User profile fetched successfully");
});

exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  sendResponse(null, 200, res, "User logged out successfully");
});
