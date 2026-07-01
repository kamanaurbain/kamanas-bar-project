const generateSaleNumber = () => {
  const timestamp = Date.now();

  return `VTE-${timestamp}`;
};

module.exports = generateSaleNumber;