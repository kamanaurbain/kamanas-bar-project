const notFound = (req, res, next) => {
  const error = new Error(`Route introuvable: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Erreur serveur.",
  });
};

module.exports = {
  notFound,
  errorHandler,
};
