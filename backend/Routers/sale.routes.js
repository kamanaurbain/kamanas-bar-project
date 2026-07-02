const express = require("express");
const saleController = require("../Controller/sale.controller");
const asyncHandler = require("../Middlewares/async.middleware");
const protect = require("../Middlewares/auth.middleware");
const { validateSaleCreate, validateSaleUpdate } = require("../Middlewares/validation.middleware");

const router = express.Router();

router.use(protect);

router.get("/history", asyncHandler(saleController.listSalesHistory));

router
  .route("/")
  .get(asyncHandler(saleController.listSales))
  .post(validateSaleCreate, asyncHandler(saleController.createSale));

router
  .route("/:id")
  .get(asyncHandler(saleController.getSale))
  .put(validateSaleUpdate, asyncHandler(saleController.updateSale))
  .delete(asyncHandler(saleController.deleteSale));

module.exports = router;
