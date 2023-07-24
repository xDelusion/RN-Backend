require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXP: process.env.JWT_EXP,
};
