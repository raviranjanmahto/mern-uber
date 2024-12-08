const Driver = require("../models/driverModel"); // Import the Driver model
const User = require("../models/userModel"); // Import the User model
const AppError = require("../utils/appError"); // Utility to handle errors
const catchAsync = require("../utils/catchAsync"); // Utility to catch async errors
const sendResponse = require("../utils/sendResponse"); // Utility to send responses

exports.createDriver = catchAsync(async (req, res, next) => {
  // Destructure fields from the request body
  const { vehicleType, vehicleNumber, licenseNumber, color, capacity } =
    req.body;

  // Check if the required fields are provided
  if (!vehicleType || !vehicleNumber || !licenseNumber || !color || !capacity)
    return next(new AppError("All fields are required", 400));

  // Check if the user exists
  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError("User not found", 404));

  // Check if the user already has the role of 'driver'
  if (user.role === "driver")
    return next(new AppError("This user is already a driver", 400));

  // Create a new driver
  const driver = await Driver.create({
    user: user._id, // Reference to the User model
    vehicleType,
    vehicleNumber,
    licenseNumber,
    color,
    capacity,
  });

  // Update the user's role to 'driver'
  user.role = "driver";
  await user.save();

  // Send a success response with the created driver data
  sendResponse(driver, 201, res, "Driver created successfully");
});
