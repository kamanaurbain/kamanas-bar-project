const counterRepository = require("../Repository/counter.repository");

const ID_FORMATS = {
  product: {
    prefix: "PRO",
    width: 3,
  },
  sale: {
    prefix: "VTE",
    width: 6,
  },
  invoice: {
    prefix: "FAC",
    width: 6,
  },
  user: {
    prefix: "UTI",
    width: 5,
  },
};

const formatVisibleId = (key, sequence) => {
  const format = ID_FORMATS[key];

  if (!format) {
    throw new Error(`Format d'ID inconnu: ${key}`);
  }

  return `${format.prefix}-${String(sequence).padStart(format.width, "0")}`;
};

const generateVisibleId = async (key) => {
  const sequence = await counterRepository.getNextSequence(key);
  return formatVisibleId(key, sequence);
};

const generateProductId = () => generateVisibleId("product");
const generateSaleId = () => generateVisibleId("sale");
const generateInvoiceId = () => generateVisibleId("invoice");
const generateUserId = () => generateVisibleId("user");

module.exports = {
  formatVisibleId,
  generateProductId,
  generateSaleId,
  generateInvoiceId,
  generateUserId,
};
