const mongoose = require("mongoose");

const saleProductSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
    id: false,
  }
);

const saleSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    client: {
      type: String,
      required: true,
      trim: true,
    },
    cashier: {
      type: String,
      required: true,
      trim: true,
    },
    total: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: "Terminée",
      trim: true,
    },
    products: {
      type: [saleProductSchema],
      default: undefined,
    },
    productsCount: {
      type: String,
      trim: true,
    },
    receivedAmount: {
      type: String,
      trim: true,
    },
    change: {
      type: String,
      trim: true,
    },
  },
  {
    id: false,
    timestamps: true,
    versionKey: false,
  }
);

saleSchema.index({ id: "text", client: "text", cashier: "text", total: "text" });
saleSchema.index({ status: 1, cashier: 1, createdAt: -1 });

module.exports = mongoose.models.Sale || mongoose.model("Sale", saleSchema);
