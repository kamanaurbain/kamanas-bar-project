const ApiError = require("../utils/ApiError");
const authService = require("../Services/auth.service");
const asyncHandler = require("./async.middleware");

const protect = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : null;

  if (!token) {
    throw new ApiError(401, "Token JWT manquant.");
  }

  req.user = await authService.getUserFromToken(token);
  next();
});

module.exports = protect;
