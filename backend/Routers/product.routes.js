const express = require("express");
const productController = require("../Controller/product.controller");
const asyncHandler = require("../Middlewares/async.middleware");
const protect = require("../Middlewares/auth.middleware");
const { validateProduct } = require("../Middlewares/validation.middleware");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(asyncHandler(productController.listProducts))
  .post(validateProduct, asyncHandler(productController.createProduct));

router
  .route("/:id")
  .get(asyncHandler(productController.getProduct))
  .put(validateProduct, asyncHandler(productController.updateProduct))
  .delete(asyncHandler(productController.deleteProduct));

module.exports = router;
