const Sale = require("../Models/sale.model");

const buildFilters = ({ search, status, cashier } = {}) => {
  const filters = {};

  if (status) {
    filters.status = status;
  }

  if (cashier) {
    filters.cashier = cashier;
  }

  if (search) {
    const pattern = new RegExp(search, "i");
    filters.$or = [
      { id: pattern },
      { client: pattern },
      { cashier: pattern },
      { total: pattern },
    ];
  }

  return filters;
};

const findAll = (query) => {
  return Sale.find(buildFilters(query)).sort({ createdAt: -1, _id: -1 }).lean();
};

const findById = (id) => {
  return Sale.findOne({ id }).lean();
};

const create = (data) => {
  return Sale.create(data);
};

const updateById = (id, data) => {
  return Sale.findOneAndUpdate({ id }, data, { new: true, runValidators: true }).lean();
};

const deleteById = (id) => {
  return Sale.findOneAndDelete({ id }).lean();
};

const count = () => {
  return Sale.countDocuments();
};

const insertMany = (sales) => {
  return Sale.insertMany(sales);
};

const maxVisibleNumber = async () => {
  const sales = await Sale.find({}, { id: 1, _id: 0 }).lean();

  return sales.reduce((max, sale) => {
    const value = Number(String(sale.id || "").replace(/\D/g, ""));
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
