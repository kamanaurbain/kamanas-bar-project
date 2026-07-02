const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    saleId: {
      type: String,
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
      trim: true,
    },
    status: {
      type: String,
      default: "Payée",
      trim: true,
    },
  },
  {
    id: false,
    timestamps: true,
    versionKey: false,
  }
);

invoiceSchema.index({ id: "text", saleId: "text", client: "text", cashier: "text", total: "text" });
invoiceSchema.index({ status: 1, cashier: 1, createdAt: -1 });

module.exports = mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
