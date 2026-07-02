const mongoose = require("mongoose");

const permissionsSchema = new mongoose.Schema(
  {
    sales: {
      type: Boolean,
      default: true,
    },
    products: {
      type: Boolean,
      default: true,
    },
    invoices: {
      type: Boolean,
      default: true,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    users: {
      type: Boolean,
      default: false,
    },
    history: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
    id: false,
  }
);

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    authId: {
      type: Number,
      sparse: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "Caissier",
      trim: true,
    },
    authRole: {
      type: String,
      trim: true,
    },
    fullRole: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      default: "Actif",
      trim: true,
    },
    dateCreated: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
      default: "",
      trim: true,
    },
    permissions: {
      type: permissionsSchema,
      default: undefined,
    },
  },
  {
    id: false,
    timestamps: true,
    versionKey: false,
  }
);

userSchema.index({ id: "text", name: "text", email: "text", phone: "text", role: "text" });
userSchema.index({ status: 1, role: 1, createdAt: -1 });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
