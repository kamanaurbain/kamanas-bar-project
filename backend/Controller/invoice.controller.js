const invoiceService = require("../Services/invoice.service");

const listInvoices = async (req, res) => {
  const invoices = await invoiceService.listInvoices(req.query);
  res.status(200).json(invoices);
};

const getInvoice = async (req, res) => {
  const invoice = await invoiceService.getInvoice(req.params.id);
  res.status(200).json(invoice);
};

const createInvoice = async (req, res) => {
  const invoice = await invoiceService.createInvoice(req.body);
  res.status(201).json(invoice);
};

const updateInvoice = async (req, res) => {
  const invoice = await invoiceService.updateInvoice(req.params.id, req.body);
  res.status(200).json(invoice);
};

const deleteInvoice = async (req, res) => {
  const result = await invoiceService.deleteInvoice(req.params.id);
  res.status(200).json(result);
};

module.exports = {
  listInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
