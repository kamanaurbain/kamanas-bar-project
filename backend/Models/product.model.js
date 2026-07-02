const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: "Disponible",
      trim: true,
    },
    dateAdded: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      default: "Aucune description.",
      trim: true,
    },
    minStock: {
      type: String,
      default: "0",
      trim: true,
    },
    reference: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    id: false,
    timestamps: true,
    versionKey: false,
  }
);

productSchema.index({ name: "text", id: "text", reference: "text", category: "text" });
productSchema.index({ status: 1, category: 1, createdAt: -1 });

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
