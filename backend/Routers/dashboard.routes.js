const express = require("express");
const dashboardController = require("../Controller/dashboard.controller");
const asyncHandler = require("../Middlewares/async.middleware");
const protect = require("../Middlewares/auth.middleware");

const router = express.Router();

router.get("/", protect, asyncHandler(dashboardController.getDashboard));

module.exports = router;
