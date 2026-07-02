const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGOCLUSTER;

  if (!mongoUri) {
    throw new Error("MONGODB_URI est obligatoire.");
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erreur connexion MongoDB : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
