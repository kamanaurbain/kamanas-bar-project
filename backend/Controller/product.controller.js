const productService = require("../Services/product.service");

const listProducts = async (req, res) => {
  const products = await productService.listProducts(req.query);
  res.status(200).json(products);
};

const getProduct = async (req, res) => {
  const product = await productService.getProduct(req.params.id);
  res.status(200).json(product);
};

const createProduct = async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.status(200).json(product);
};

const deleteProduct = async (req, res) => {
  const result = await productService.deleteProduct(req.params.id);
  res.status(200).json(result);
};

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
