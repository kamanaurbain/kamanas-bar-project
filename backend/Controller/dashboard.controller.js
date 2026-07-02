const dashboardService = require("../Services/dashboard.service");

const getDashboard = async (req, res) => {
  const dashboard = await dashboardService.getDashboard();
  res.status(200).json(dashboard);
};

module.exports = {
  getDashboard,
};
