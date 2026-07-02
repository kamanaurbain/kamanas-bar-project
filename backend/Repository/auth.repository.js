const userRepository = require("./user.repository");

const findByEmail = (email) => {
  return userRepository.findByEmail(email);
};

const findByMongoId = (mongoId) => {
  return userRepository.findByMongoId(mongoId);
};

const findAdminAuthUser = () => {
  return userRepository.findAdminAuthUser();
};

const createUser = (data) => {
  return userRepository.create(data);
};

module.exports = {
  findByEmail,
  findByMongoId,
  findAdminAuthUser,
  createUser,
};
