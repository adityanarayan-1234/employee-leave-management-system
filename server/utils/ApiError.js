// A small custom error class so controllers can throw a meaningful
// HTTP status code + message, and the centralized error handler
// knows how to respond correctly.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;
