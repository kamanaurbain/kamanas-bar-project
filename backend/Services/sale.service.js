const saleRepository = require("../Repository/sale.repository");
const ApiError = require("../utils/ApiError");
const { generateSaleId } = require("../utils/idGenerator");
const { cleanNumber, formatCurrency, formatDateTime, normalizeString } = require("../utils/formatters");
const { serializeSale } = require("../utils/serializers");

const toPlain = (document) => {
  return document && typeof document.toObject === "function" ? document.toObject() : document;
};

const normalizeSaleProducts = (products = []) => {
  return products.map((product) => ({
    id: normalizeString(product.id),
    name: normalizeString(product.name),
    price: normalizeString(product.price),
    quantity: Number(product.quantity) || 0,
  }));
};

const calculateSaleTotal = (products) => {
  return products.reduce((sum, product) => {
    return sum + cleanNumber(product.price) * (Number(product.quantity) || 0);
  }, 0);
};

const listSales = async (query) => {
  const sales = await saleRepository.findAll(query);
  return sales.map(serializeSale);
};

const getSale = async (id) => {
  const sale = await saleRepository.findById(id);

  if (!sale) {
    throw new ApiError(404, "Vente introuvable.");
  }

  return serializeSale(sale);
};

const createSale = async (payload) => {
  const products = normalizeSaleProducts(payload.products);
  const total = calculateSaleTotal(products);
  const received = cleanNumber(payload.receivedAmount);

  const data = {
    id: await generateSaleId(),
    client: normalizeString(payload.client),
    cashier: normalizeString(payload.cashier),
    total: formatCurrency(total),
    date: normalizeString(payload.date) || formatDateTime(),
    status: normalizeString(payload.status) || "Terminée",
    products,
    receivedAmount: formatCurrency(received),
    change: formatCurrency(Math.max(received - total, 0)),
  };

  // TODO: garder ce comportement frontend: la vente ne décrémente pas le stock.
  const sale = await saleRepository.create(data);
  return serializeSale(toPlain(sale));
};

const updateSale = async (id, payload) => {
  const data = {};

  ["client", "cashier", "date", "status"].forEach((field) => {
    if (payload[field] !== undefined) {
      data[field] = normalizeString(payload[field]);
    }
  });

  if (payload.total !== undefined) {
    data.total = formatCurrency(payload.total);
  }

  const sale = await saleRepository.updateById(id, data);

  if (!sale) {
    throw new ApiError(404, "Vente introuvable.");
  }

  return serializeSale(sale);
};

const deleteSale = async (id) => {
  const sale = await saleRepository.deleteById(id);

  if (!sale) {
    throw new ApiError(404, "Vente introuvable.");
  }

  return {
    success: true,
    deletedId: id,
  };
};

const listSalesHistory = async (query) => {
  const sales = await saleRepository.findAll(query);

  return sales.map((sale) => ({
    id: sale.id,
    client: sale.client,
    cashier: sale.cashier,
    products: Array.isArray(sale.products) ? `${sale.products.length} article(s)` : sale.productsCount || "3 articles",
    total: sale.total,
    date: sale.date,
    status: sale.status,
    productsList: sale.products || [],
    receivedAmount: sale.receivedAmount || "25 000 FBu",
    change: sale.change || "5 000 FBu",
  }));
};

module.exports = {
  listSales,
  getSale,
  createSale,
  updateSale,
  deleteSale,
  listSalesHistory,
};
