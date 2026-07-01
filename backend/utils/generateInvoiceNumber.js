const generateInvoiceNumber = () => {
  const timestamp = Date.now();

  return `FAC-${timestamp}`;
};

module.exports = generateInvoiceNumber;