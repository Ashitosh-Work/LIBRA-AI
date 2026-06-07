const AppError = require("../utils/AppError");

function notFound(req, _res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

function errorHandler(error, _req, res, _next) {
  let err = error;

  if (error.name === "ValidationError") {
    const details = Object.values(error.errors).reduce((acc, item) => {
      acc[item.path] = item.message;
      return acc;
    }, {});
    err = new AppError("Validation failed", 400, details);
  }

  if (error.code === 11000) {
    err = new AppError("A record with this value already exists", 409, error.keyValue);
  }

  if (error.name === "CastError") {
    err = new AppError("Invalid resource identifier", 400);
  }

  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: statusCode === 500 ? "Internal server error" : err.message
  };

  if (err.details) {
    response.details = err.details;
  }

  if (process.env.NODE_ENV !== "production" && statusCode === 500) {
    response.stack = error.stack;
  }

  if (statusCode === 500) {
    console.error(error);
  }

  res.status(statusCode).json(response);
}

module.exports = {
  notFound,
  errorHandler
};
