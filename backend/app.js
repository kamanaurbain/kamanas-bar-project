const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

const authRoutes = require("./Routers/auth.routes");
const productRoutes = require("./Routers/product.routes");
const saleRoutes = require("./Routers/sale.routes");
const invoiceRoutes = require("./Routers/invoice.routes");
const userRoutes = require("./Routers/user.routes");
const dashboardRoutes = require("./Routers/dashboard.routes");
const { notFound, errorHandler } = require("./Middlewares/error.middleware");

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "Config", "conf.env") });

const app = express();

const allowedOrigins = new Set (["http://localhost:5173", "http://127.0.0.1:5173"]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origine CORS non autorisée."));
    },
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Kamana's Bar API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
