const invoiceRepository = require("../Repository/invoice.repository");
const saleRepository = require("../Repository/sale.repository");
const ApiError = require("../utils/ApiError");
const { generateInvoiceId, generateSaleId } = require("../utils/idGenerator");
const { cleanNumber, formatCurrency, formatDateTime, normalizeString } = require("../utils/formatters");
const { serializeInvoice, serializeInvoiceDetails } = require("../utils/serializers");
const { invoiceProducts: defaultInvoiceProducts } = require("../utils/defaultData");

const toPlain = (document) => {
  return document && typeof document.toObject === "function" ? document.toObject() : document;
};

const listInvoices = async (query) => {
  const invoices = await invoiceRepository.findAll(query);
  return invoices.map(serializeInvoice);
};

const deriveInvoiceProducts = async (invoice) => {
  const sale = invoice.saleId ? await saleRepository.findById(invoice.saleId) : null;

  if (!sale || !Array.isArray(sale.products) || sale.products.length === 0) {
    return defaultInvoiceProducts;
  }

  return sale.products.map((product) => {
    const quantity = Number(product.quantity) || 0;
    const unitAmount = cleanNumber(product.price);

    return {
      product: product.name,
      quantity,
      unitPrice: formatCurrency(unitAmount),
      amount: formatCurrency(unitAmount * quantity),
    };
  });
};

const getInvoice = async (id) => {
  const invoice = await invoiceRepository.findById(id);

  if (!invoice) {
    throw new ApiError(404, "Facture introuvable.");
  }

  const products = await deriveInvoiceProducts(invoice);
  return serializeInvoiceDetails(invoice, products);
};

const createInvoice = async (payload) => {
  const saleId = normalizeString(payload.saleId) || (await generateSaleId());

  const data = {
    id: await generateInvoiceId(),
    saleId,
    client: normalizeString(payload.client),
    cashier: normalizeString(payload.cashier),
    total: formatCurrency(payload.total),
    date: normalizeString(payload.date) || formatDateTime(),
    status: normalizeString(payload.status) || "Payée",
  };

  const invoice = await invoiceRepository.create(data);
  return serializeInvoice(toPlain(invoice));
};

const updateInvoice = async (id, payload) => {
  const data = {};

  ["saleId", "client", "cashier", "date", "status"].forEach((field) => {
    if (payload[field] !== undefined) {
      data[field] = normalizeString(payload[field]);
    }
  });

  if (payload.total !== undefined) {
    data.total = formatCurrency(payload.total);
  }

  const invoice = await invoiceRepository.updateById(id, data);

  if (!invoice) {
    throw new ApiError(404, "Facture introuvable.");
  }

  return serializeInvoice(invoice);
};

const deleteInvoice = async (id) => {
  const invoice = await invoiceRepository.deleteById(id);

  if (!invoice) {
    throw new ApiError(404, "Facture introuvable.");
  }

  return {
    success: true,
    deletedId: id,
  };
};

module.exports = {
  listInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
