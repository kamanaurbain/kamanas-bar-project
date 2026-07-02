const userService = require("../Services/user.service");

const listUsers = async (req, res) => {
  const users = await userService.listUsers(req.query);
  res.status(200).json(users);
};

const getUser = async (req, res) => {
  const user = await userService.getUser(req.params.id);
  res.status(200).json(user);
};

const createUser = async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
};

const updateUser = async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  res.status(200).json(user);
};

const deleteUser = async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  res.status(200).json(result);
};

module.exports = {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
