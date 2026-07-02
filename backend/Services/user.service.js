const userRepository = require("../Repository/user.repository");
const ApiError = require("../utils/ApiError");
const hashPassword = require("../utils/hashPassword");
const { generateUserId } = require("../utils/idGenerator");
const { formatDate, normalizeString } = require("../utils/formatters");
const { serializeUser } = require("../utils/serializers");

const DEFAULT_PERMISSIONS = {
  sales: true,
  products: true,
  invoices: true,
  admin: false,
  users: false,
  history: true,
};

const toPlain = (document) => {
  return document && typeof document.toObject === "function" ? document.toObject() : document;
};

const normalizeUserPayload = async (payload, { partial = false } = {}) => {
  const data = {};

  ["name", "email", "phone", "role", "status", "dateCreated", "photo"].forEach((field) => {
    if (payload[field] !== undefined) {
      data[field] = normalizeString(payload[field]);
    }
  });

  if (!partial) {
    data.role = data.role || "Caissier";
    data.status = data.status || "Actif";
    data.dateCreated = data.dateCreated || formatDate();
    data.photo = data.photo || "";
    data.permissions = payload.permissions || DEFAULT_PERMISSIONS;
  } else if (payload.permissions !== undefined) {
    data.permissions = payload.permissions;
  }

  if (payload.password) {
    data.password = await hashPassword(payload.password);
  }

  return data;
};

const listUsers = async (query) => {
  const users = await userRepository.findAll(query);
  return users.map(serializeUser);
};

const getUser = async (id) => {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new ApiError(404, "Utilisateur introuvable.");
  }

  return serializeUser(user);
};

const createUser = async (payload) => {
  const data = await normalizeUserPayload(payload);
  data.id = await generateUserId();

  const user = await userRepository.create(data);
  return serializeUser(toPlain(user));
};

const updateUser = async (id, payload) => {
  const data = await normalizeUserPayload(payload, { partial: true });
  const user = await userRepository.updateById(id, data);

  if (!user) {
    throw new ApiError(404, "Utilisateur introuvable.");
  }

  return serializeUser(user);
};

const deleteUser = async (id) => {
  const user = await userRepository.deleteById(id);

  if (!user) {
    throw new ApiError(404, "Utilisateur introuvable.");
  }

  return {
    success: true,
    deletedId: id,
  };
};

module.exports = {
  DEFAULT_PERMISSIONS,
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
