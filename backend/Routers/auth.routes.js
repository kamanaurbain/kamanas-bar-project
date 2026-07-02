const express = require("express");
const authController = require("../Controller/auth.controller");
const asyncHandler = require("../Middlewares/async.middleware");
const protect = require("../Middlewares/auth.middleware");
const { validateLogin } = require("../Middlewares/validation.middleware");

const router = express.Router();

router.post("/login", validateLogin, asyncHandler(authController.login));
router.get("/me", protect, asyncHandler(authController.me));
router.post("/logout", protect, asyncHandler(authController.logout));

module.exports = router;
