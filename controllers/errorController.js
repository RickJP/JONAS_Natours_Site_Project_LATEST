const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const msg = `Invalid ${err.path}: ${err.value}`;
  return new AppError(msg, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const msg = `Duplicate field value: ${value}, Please use another value!`;
  return new AppError(msg, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // RENDERED WEBSITE
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
};

const handleJWTErrorDev = () =>
  new AppError('Invalid token. Please login again.', 401);
const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please login again.', 401);

const sendErrProd = (err, req, res) => {
  // APIS
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
     // Programming error or other unknown error: don't leak error details
    // Log console.error
    console.error('ERROR 💥', err);
    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }

  // RENDERED WEBSITE
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later.'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    //let error = {...err};
    let error = Object.create(err);

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTErrorDev();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrProd(error, req, res);
  }
};
