const ApiError = require("../utils/ApiError");


const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found - ${req.originalUrl}`));
};


const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  
  if (err.code === 11000) {
    statusCode = 400;
    message = "That value is already in use";
  }

  
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
