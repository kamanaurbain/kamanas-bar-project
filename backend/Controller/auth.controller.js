const authService = require("../Services/auth.service");

const login = async (req, res) => {
  const result = await authService.login(req.body);
  res.status(200).json(result);
};

const me = async (req, res) => {
  res.status(200).json(authService.getMe(req.user));
};

const logout = async (req, res) => {
  res.status(200).json(authService.logout());
};

module.exports = {
  login,
  me,
  logout,
};
