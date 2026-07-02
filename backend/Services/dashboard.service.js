const {
  dashboardStats,
  dashboardSalesEvolution,
  dashboardRecentSales,
  dashboardRecentInvoices,
  dashboardTopProducts,
} = require("../utils/defaultData");

const getDashboard = async () => {
  return {
    stats: dashboardStats,
    salesEvolution: dashboardSalesEvolution,
    recentSales: dashboardRecentSales,
    recentInvoices: dashboardRecentInvoices,
    topProducts: dashboardTopProducts,
  };
};

module.exports = {
  getDashboard,
};
