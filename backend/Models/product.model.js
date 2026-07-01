import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom du produit est obligatoire"],
      trim: true,
      minlength: [2, "Le nom doit contenir au moins 2 caractères"],
      maxlength: [150, "Le nom ne peut pas dépasser 150 caractères"],
    },

    sku: {
      type: String,
      required: [true, "Le code SKU est obligatoire"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "La catégorie du produit est obligatoire"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "La description ne peut pas dépasser 1000 caractères"],
      default: "",
    },

    purchasePrice: {
      type: Number,
      min: [0, "Le prix d'achat ne peut pas être négatif"],
      default: 0,
    },

    salePrice: {
      type: Number,
      required: [true, "Le prix de vente est obligatoire"],
      min: [0, "Le prix de vente ne peut pas être négatif"],
    },

    stock: {
      type: Number,
      min: [0, "Le stock ne peut pas être négatif"],
      default: 0,
    },

    alertThreshold: {
      type: Number,
      min: [0, "Le seuil d'alerte ne peut pas être négatif"],
      default: 5,
    },

    unit: {
      type: String,
      enum: {
        values: [
          "piece",
          "bouteille",
          "verre",
          "portion",
          "kg",
          "g",
          "litre",
          "ml",
        ],
        message: "L'unité {VALUE} n'est pas valide",
      },
      default: "piece",
    },

    image: {
      url: {
        type: String,
        trim: true,
        default: "",
      },

      publicId: {
        type: String,
        trim: true,
        default: "",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Indique automatiquement si le stock est faible.
productSchema.virtual("isLowStock").get(function () {
  return this.stock <= this.alertThreshold;
});

// Marge bénéficiaire unitaire.
productSchema.virtual("profit").get(function () {
  return this.salePrice - this.purchasePrice;
});

// Index utiles pour la recherche, le filtrage et la pagination.
productSchema.index({
  name: "text",
  sku: "text",
});

productSchema.index({
  category: 1,
  isActive: 1,
  createdAt: -1,
});

const Product = mongoose.model("Product", productSchema);

export default Product;