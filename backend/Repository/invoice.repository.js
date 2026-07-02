const Invoice = require("../Models/invoice.model");

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
      { saleId: pattern },
      { client: pattern },
      { cashier: pattern },
      { total: pattern },
    ];
  }

  return filters;
};

const findAll = (query) => {
  return Invoice.find(buildFilters(query)).sort({ createdAt: -1, _id: -1 }).lean();
};

const findById = (id) => {
  return Invoice.findOne({ id }).lean();
};

const create = (data) => {
  return Invoice.create(data);
};

const updateById = (id, data) => {
  return Invoice.findOneAndUpdate({ id }, data, { new: true, runValidators: true }).lean();
};

const deleteById = (id) => {
  return Invoice.findOneAndDelete({ id }).lean();
};

const count = () => {
  return Invoice.countDocuments();
};

const insertMany = (invoices) => {
  return Invoice.insertMany(invoices);
};

const maxVisibleNumber = async () => {
  const invoices = await Invoice.find({}, { id: 1, _id: 0 }).lean();

  return invoices.reduce((max, invoice) => {
    const value = Number(String(invoice.id || "").replace(/\D/g, ""));
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
