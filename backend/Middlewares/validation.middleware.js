const ApiError = require("../utils/ApiError");

const isBlank = (value) => {
  return value === undefined || value === null || String(value).trim() === "";
};

const requireFields = (fields) => {
  return (req, res, next) => {
    const missing = fields.filter((field) => isBlank(req.body[field]));

    if (missing.length > 0) {
      throw new ApiError(400, `Champs obligatoires manquants: ${missing.join(", ")}.`);
    }

    next();
  };
};

const validateLogin = requireFields(["email", "password"]);

const validateProduct = requireFields(["name", "category", "price", "stock", "unit", "reference"]);

const validateSaleCreate = (req, res, next) => {
  const missing = ["client", "cashier"].filter((field) => isBlank(req.body[field]));

  if (missing.length > 0) {
    throw new ApiError(400, `Champs obligatoires manquants: ${missing.join(", ")}.`);
  }

  if (!Array.isArray(req.body.products) || req.body.products.length === 0) {
    throw new ApiError(400, "Au moins un produit est obligatoire pour créer une vente.");
  }

  next();
};

const validateSaleUpdate = requireFields(["client", "cashier", "total"]);

const validateInvoice = requireFields(["client", "cashier", "total"]);

const validateUserCreate = (req, res, next) => {
  const missing = ["name", "email", "phone", "password"].filter((field) => isBlank(req.body[field]));

  if (missing.length > 0) {
    throw new ApiError(400, `Champs obligatoires manquants: ${missing.join(", ")}.`);
  }

  if (String(req.body.password).length < 8) {
    throw new ApiError(400, "Le mot de passe doit contenir au moins 8 caractères.");
  }

  if (req.body.confirmPassword !== undefined && req.body.password !== req.body.confirmPassword) {
    throw new ApiError(400, "Les mots de passe ne correspondent pas.");
  }

  next();
};

const validateUserUpdate = requireFields(["name", "email", "phone"]);

module.exports = {
  requireFields,
  validateLogin,
  validateProduct,
  validateSaleCreate,
  validateSaleUpdate,
  validateInvoice,
  validateUserCreate,
  validateUserUpdate,
};
