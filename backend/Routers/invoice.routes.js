const express = require("express");
const invoiceController = require("../Controller/invoice.controller");
const asyncHandler = require("../Middlewares/async.middleware");
const protect = require("../Middlewares/auth.middleware");
const { validateInvoice } = require("../Middlewares/validation.middleware");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(asyncHandler(invoiceController.listInvoices))
  .post(validateInvoice, asyncHandler(invoiceController.createInvoice));

router
  .route("/:id")
  .get(asyncHandler(invoiceController.getInvoice))
  .put(validateInvoice, asyncHandler(invoiceController.updateInvoice))
  .delete(asyncHandler(invoiceController.deleteInvoice));

module.exports = router;
