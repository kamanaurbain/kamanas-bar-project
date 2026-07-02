const User = require("../Models/user.model");

const buildFilters = ({ search, role, status } = {}) => {
  const filters = {};

  if (role) {
    filters.role = role;
  }

  if (status) {
    filters.status = status;
  }

  if (search) {
    const pattern = new RegExp(search, "i");
    filters.$or = [
      { id: pattern },
      { name: pattern },
      { email: pattern },
      { phone: pattern },
      { role: pattern },
    ];
  }

  return filters;
};

const findAll = (query) => {
  return User.find(buildFilters(query)).sort({ createdAt: -1, _id: -1 }).lean();
};

const findById = (id) => {
  return User.findOne({ id }).lean();
};

const findByMongoId = (mongoId) => {
  return User.findById(mongoId).lean();
};

const findByEmail = (email) => {
  return User.findOne({ email: String(email).trim() }).lean();
};

const findAdminAuthUser = () => {
  return User.findOne({ authId: 1 }).lean();
};

const create = (data) => {
  return User.create(data);
};

const updateById = (id, data) => {
  return User.findOneAndUpdate({ id }, data, { new: true, runValidators: true }).lean();
};

const deleteById = (id) => {
  return User.findOneAndDelete({ id }).lean();
};

const count = () => {
  return User.countDocuments();
};

const insertMany = (users) => {
  return User.insertMany(users);
};

const maxVisibleNumber = async () => {
  const users = await User.find({}, { id: 1, _id: 0 }).lean();

  return users.reduce((max, user) => {
    const value = Number(String(user.id || "").replace(/\D/g, ""));
    return value > max ? value : max;
  }, 0);
};

module.exports = {
  findAll,
  findById,
  findByMongoId,
  findByEmail,
  findAdminAuthUser,
  create,
  updateById,
  deleteById,
  count,
  insertMany,
  maxVisibleNumber,
};
