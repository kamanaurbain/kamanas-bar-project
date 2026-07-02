const jwt = require("jsonwebtoken");
const authRepository = require("../Repository/auth.repository");
const ApiError = require("../utils/ApiError");
const comparePassword = require("../utils/comparePassword");
const { serializeAuthUser } = require("../utils/serializers");

const getJwtSecret = () => {
  return process.env.JWT_SECRET || "KamanaBarSecretKey";
};

const signAccessToken = (user) => {
  return jwt.sign(
    {
      sub: String(user._id),
      id: user.id,
    },
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

const login = async ({ email, password }) => {
  const user = await authRepository.findByEmail(email);

  if (!user || !user.password) {
    throw new ApiError(401, "Email ou mot de passe incorrect.");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid || user.status === "Désactivé") {
    throw new ApiError(401, "Email ou mot de passe incorrect.");
  }

  return {
    user: serializeAuthUser(user),
    accessToken: signAccessToken(user),
  };
};

const getUserFromToken = async (token) => {
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    const user = await authRepository.findByMongoId(decoded.sub);

    if (!user) {
      throw new ApiError(401, "Session invalide.");
    }

    return user;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, "Session invalide.");
  }
};

const getMe = (user) => {
  return serializeAuthUser(user);
};

const logout = () => {
  return {
    success: true,
  };
};

module.exports = {
  login,
  getUserFromToken,
  getMe,
  logout,
};
