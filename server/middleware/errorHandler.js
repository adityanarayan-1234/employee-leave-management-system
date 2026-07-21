const ApiError = require("../utils/ApiError");

// Handles requests to routes that don't exist
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found - ${req.originalUrl}`));
};

// Central place for every error in the app to end up. Any controller can
// just `throw new ApiError(400, "message")` or let a normal error bubble
// up via asyncHandler, and it will be turned into a clean JSON response.
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Mongoose duplicate key (e.g. registering with an email already in use)
  if (err.code === 11000) {
    statusCode = 400;
    message = "That value is already in use";
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { notFound, errorHandler };
