const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  let error = {
    message: err.message || 'Internal Server Error',
    status: err.status || 500
  };

  // Specific error handling
  if (err.name === 'ValidationError') {
    error.status = 400;
    error.message = 'Validation Error';
    error.details = Object.values(err.errors).map(e => e.message);
  }

  if (err.name === 'CastError') {
    error.status = 400;
    error.message = 'Invalid ID format';
  }

  // Gemini API specific errors
  if (err.message.includes('API_KEY')) {
    error.status = 500;
    error.message = 'API configuration error';
  }

  if (err.message.includes('quota') || err.message.includes('rate limit')) {
    error.status = 429;
    error.message = 'API rate limit exceeded. Please try again later.';
  }

  // Don't send stack trace in production
  if (process.env.NODE_ENV === 'production') {
    delete err.stack;
  } else {
    error.stack = err.stack;
  }

  res.status(error.status).json({
    error: true,
    ...error
  });
};

module.exports = errorHandler;
