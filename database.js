const mongoose = require("mongoose");
const { MONGO_DB_URL } = require("./config/keys");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_DB_URL);
    console.log("Connected to DB");
  } catch (error) {
    console.log("Connection to DB failed", error);
  }
};

module.exports = connectDB;
