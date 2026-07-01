const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOCLUSTER);
    console.log(`MongoDB connecte : ${conn.connection.host}`
    );
  } catch (error) {
    console.error(` Erreur connexion MongoDB : ${error.message}`
    );

    process.exit(1);
  }
};

module.exports = connectDB;