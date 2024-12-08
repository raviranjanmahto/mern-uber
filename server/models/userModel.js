const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Define the user schema to structure user-related data in the database
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minlength: [3, "First name must be at least 3 characters long"],
      trim: true,
    },
    lastName: {
      type: String,
      minlength: [3, "Last name must be at least 3 characters long"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
      minlength: [5, "Email must be at least 5 characters long"],
      lowercase: true, // Ensures all email addresses are stored in lowercase
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Excludes password in queries by default
    },
    role: {
      type: String,
      enum: ["user", "driver", "admin"],
      default: "user",
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\+?\d{10,15}$/, "Please provide a valid phone number"],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
); // Automatically manages `createdAt` and `updatedAt` timestamps

/* ----------------------------- Password Hashing ----------------------------- */

// Hash the password before saving the user document
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password isn't modified

  this.password = await bcrypt.hash(this.password, 12); // Hash password with bcrypt
  this.passwordChangedAt = Date.now() - 1000; // Set passwordChangedAt slightly earlier to ensure token validity
  next();
});

/* ------------------------------- Instance Methods ------------------------------- */

// Compare provided password with hashed password in the database
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if the password was changed after the token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Generate a password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

  return resetToken;
};

// Virtual to hide certain fields when converting to JSON
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

// Create the User model from the schema
const User = mongoose.model("User", userSchema);

// Export the User model for use in other parts of the application
module.exports = User;
