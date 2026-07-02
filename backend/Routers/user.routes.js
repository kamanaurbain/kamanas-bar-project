const express = require("express");
const userController = require("../Controller/user.controller");
const asyncHandler = require("../Middlewares/async.middleware");
const protect = require("../Middlewares/auth.middleware");
const { validateUserCreate, validateUserUpdate } = require("../Middlewares/validation.middleware");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(asyncHandler(userController.listUsers))
  .post(validateUserCreate, asyncHandler(userController.createUser));

router
  .route("/:id")
  .get(asyncHandler(userController.getUser))
  .put(validateUserUpdate, asyncHandler(userController.updateUser))
  .delete(asyncHandler(userController.deleteUser));

module.exports = router;
