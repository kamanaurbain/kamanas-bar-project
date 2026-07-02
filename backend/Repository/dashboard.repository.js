const productRepository = require("./product.repository");
const saleRepository = require("./sale.repository");
const invoiceRepository = require("./invoice.repository");
const userRepository = require("./user.repository");

const getSnapshot = async () => {
  const [products, sales, invoices, users] = await Promise.all([
    productRepository.findAll({}),
    saleRepository.findAll({}),
    invoiceRepository.findAll({}),
    userRepository.findAll({}),
  ]);

  return {
    products,
    sales,
    invoices,
    users,
  };
};

module.exports = {
  getSnapshot,
};
