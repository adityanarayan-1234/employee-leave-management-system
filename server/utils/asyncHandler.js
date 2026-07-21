// Wraps an async route handler so any thrown error (or rejected promise)
// is automatically forwarded to Express's error-handling middleware,
// instead of every controller needing its own try/catch block.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
