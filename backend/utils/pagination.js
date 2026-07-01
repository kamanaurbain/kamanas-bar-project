const getPagination = (page, limit) => {
  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 10;

  const skip =
    (currentPage - 1) * currentLimit;

  return {
    currentPage,
    currentLimit,
    skip,
  };
};

module.exports = getPagination;