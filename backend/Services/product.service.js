const productRepository = require("../Repository/product.repository");
const ApiError = require("../utils/ApiError");
const { generateProductId } = require("../utils/idGenerator");
const { formatDate, normalizeString } = require("../utils/formatters");
const { serializeProduct } = require("../utils/serializers");

const toPlain = (document) => {
  return document && typeof document.toObject === "function" ? document.toObject() : document;
};

const normalizeProductPayload = (payload, { partial = false } = {}) => {
  const data = {};

  const assignString = (field) => {
    if (payload[field] !== undefined) {
      data[field] = normalizeString(payload[field]);
    }
  };

  ["name", "category", "price", "stock", "unit", "reference", "dateAdded"].forEach(assignString);

  if (!partial || payload.status !== undefined) {
    data.status = normalizeString(payload.status) || "Disponible";
  }

  if (!partial || payload.description !== undefined) {
    data.description = normalizeString(payload.description) || "Aucune description.";
  }

  if (!partial || payload.minStock !== undefined) {
    data.minStock = normalizeString(payload.minStock) || "0";
  }

  if (!partial && !data.dateAdded) {
    data.dateAdded = formatDate();
  }

  return data;
};

const listProducts = async (query) => {
  const products = await productRepository.findAll(query);
  return products.map(serializeProduct);
};

const getProduct = async (id) => {
  const product = await productRepository.findById(id);

  if (!product) {
    throw new ApiError(404, "Produit introuvable.");
  }

  return serializeProduct(product);
};

const createProduct = async (payload) => {
  const data = normalizeProductPayload(payload);
  data.id = await generateProductId();

  const product = await productRepository.create(data);
  return serializeProduct(toPlain(product));
};

const updateProduct = async (id, payload) => {
  const data = normalizeProductPayload(payload, { partial: true });
  const product = await productRepository.updateById(id, data);

  if (!product) {
    throw new ApiError(404, "Produit introuvable.");
  }

  return serializeProduct(product);
};

const deleteProduct = async (id) => {
  const product = await productRepository.deleteById(id);

  if (!product) {
    throw new ApiError(404, "Produit introuvable.");
  }

  return {
    success: true,
    deletedId: id,
  };
};

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
