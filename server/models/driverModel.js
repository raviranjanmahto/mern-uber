const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ["Car", "Bike", "Auto", "Van"],
      required: [true, "Vehicle type is required"],
    },
    vehicleNumber: {
      type: String,
      required: [true, "Vehicle number is required"],
      uppercase: true,
    },
    licenseNumber: {
      type: String,
      required: [true, "License number is required"],
      uppercase: true,
    },
    color: {
      type: String,
      required: [true, "Vehicle color is required"],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, "Vehicle capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    availabilityStatus: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Driver = mongoose.model("Driver", driverSchema);

module.exports = Driver;
