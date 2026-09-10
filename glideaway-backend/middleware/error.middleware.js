/** Catches async route errors so controllers don't need try/catch everywhere. */
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

/** Express error handler — must be registered last in server.js. */
function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Something went wrong on our end. Please try again.',
  });
}

module.exports = { asyncHandler, errorHandler };
