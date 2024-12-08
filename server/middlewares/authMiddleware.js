const jwt = require("jsonwebtoken");

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

exports.protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next(new AppError("Please login to get access", 401));

  // Verify the token and decode it to get user data
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Check if the user is still active and not deleted
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError("User no longer exists. Please log in again.", 401)
    );

  // Attach the user to the request object for further use
  req.user = currentUser;
  next();
});
