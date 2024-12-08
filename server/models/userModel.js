const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Define the user schema to structure user-related data in the database
const userSchema = new mongoose.Schema(
  {
    // User's first name with required validation and minimum length
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minlength: [3, "First name must be at least 3 characters long"],
    },
    // User's last name with minimum length validation
    lastName: {
      type: String,
      minlength: [3, "Last name must be at least 3 characters long"],
    },
    // Email with required validation, uniqueness constraint, format check, and lowercase conversion
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
      minlength: [5, "Email must be at least 5 characters long"],
      lowercase: true, // Ensures all email addresses are stored in lowercase
    },
    // Password field with secure default selection settings
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Excludes password in queries by default
    },
    // Optional field for storing a real-time socket ID for the user
    socketId: {
      type: String,
    },
  },
  { timestamps: true }
); // Automatically manages `createdAt` and `updatedAt` timestamps

// Generate a JSON Web Token (JWT) for user authentication
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: "24h" } // Token expiration time
  );
};

// Pre-save middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 11
  this.password = await bcrypt.hash(this.password, 11);

  next();
});

// Compare a plain-text password with the hashed password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
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
