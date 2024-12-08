const jwt = require("jsonwebtoken");
const sendResponse = require("./sendResponse");

// Function to generate a JWT token
const signToken = (id, secret, expiresIn) => {
  return jwt.sign({ id }, secret, { expiresIn });
};

// Function to send JWT tokens as cookies and respond with user data
const sendCookieToken = (user, statusCode, res, message) => {
  const token = signToken(
    user._id,
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN || "30d" // Default to 30 day if no expiration is set
  );

  // Define options for the cookies
  const cookieOptions = {
    httpOnly: true, // Cookie is only accessible via HTTP(S), not JavaScript
    secure: process.env.NODE_ENV === "production", // Set secure flag only in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Use "none" for cross-domain cookies in prod, "lax" in dev
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  // Set the token as a cookie in the response header
  res.cookie("token", token, cookieOptions);

  // Send user data as response
  sendResponse(user, statusCode, res, message);
};

module.exports = sendCookieToken;
