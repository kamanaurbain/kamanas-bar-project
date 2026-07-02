const Product = require("../Models/product.model");

const buildFilters = ({ search, category, status } = {}) => {
  const filters = {};

  if (category) {
    filters.category = category;
  }

  if (status) {
    filters.status = status;
  }

  if (search) {
    const pattern = new RegExp(search, "i");
    filters.$or = [
      { name: pattern },
      { id: pattern },
      { reference: pattern },
      { category: pattern },
    ];
  }

  return filters;
};

const findAll = (query) => {
  return Product.find(buildFilters(query)).sort({ createdAt: -1, _id: -1 }).lean();
};

const findById = (id) => {
  return Product.findOne({ id }).lean();
};

const create = (data) => {
  return Product.create(data);
};

const updateById = (id, data) => {
  return Product.findOneAndUpdate({ id }, data, { new: true, runValidators: true }).lean();
};

const deleteById = (id) => {
  return Product.findOneAndDelete({ id }).lean();
};

const count = () => {
  return Product.countDocuments();
};

const insertMany = (products) => {
  return Product.insertMany(products);
};

const maxVisibleNumber = async () => {
  const products = await Product.find({}, { id: 1, _id: 0 }).lean();

  return products.reduce((max, product) => {
    const value = Number(String(product.id || "").replace(/\D/g, ""));
    return value > max ? value : max;
  }, 0);
};

module.exports = {
  findAll,
  findById,
  create,
  updateById,
  deleteById,
  count,
  insertMany,
  maxVisibleNumber,
};
