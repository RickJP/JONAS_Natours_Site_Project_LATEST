const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
	const msg = `Invalid ${err.path}: ${err.value}`;
	return new AppError(msg, 400);
};

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const handleDuplicateFieldsDB = err => {
  console.log('####');
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  
  const msg = `Duplicate field value: ${value}, Please use another value!`;
  return new AppError(msg, 400);
};

const sendErrProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    // Programming error or other unknown error: don't leak error details
  } else {
    // Log console.error
    console.error('ERROR 💥', err);
    // Send generic message
    
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

module.exports = (err, req, res, next ) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = {...err};
    
		if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    // if (error.name === 'ValidationError')
    //   error = handleValidationErrorDB(error);
    sendErrProd(error, res);
  }
};