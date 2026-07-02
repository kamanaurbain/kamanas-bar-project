const dotenv = require("dotenv");
const path = require("path");
const app = require("./app");
const connectDB = require("./Config/db");
const seedDatabase = require("./Config/seed");

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "Config", "conf.env") });

const port = process.env.PORT || 3050;

const startServer = async () => {
  await connectDB();
  await seedDatabase();

  app.listen(port, () => {
    console.log(`App is running on http://127.0.0.1:${port}`);
  });
};

startServer().catch((error) => {
  console.error(`Erreur démarrage serveur : ${error.message}`);
  process.exit(1);
});
