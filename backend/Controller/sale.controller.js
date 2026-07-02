const saleService = require("../Services/sale.service");

const listSales = async (req, res) => {
  const sales = await saleService.listSales(req.query);
  res.status(200).json(sales);
};

const getSale = async (req, res) => {
  const sale = await saleService.getSale(req.params.id);
  res.status(200).json(sale);
};

const createSale = async (req, res) => {
  const sale = await saleService.createSale(req.body);
  res.status(201).json(sale);
};

const updateSale = async (req, res) => {
  const sale = await saleService.updateSale(req.params.id, req.body);
  res.status(200).json(sale);
};

const deleteSale = async (req, res) => {
  const result = await saleService.deleteSale(req.params.id);
  res.status(200).json(result);
};

const listSalesHistory = async (req, res) => {
  const history = await saleService.listSalesHistory(req.query);
  res.status(200).json(history);
};

module.exports = {
  listSales,
  getSale,
  createSale,
  updateSale,
  deleteSale,
  listSalesHistory,
};
