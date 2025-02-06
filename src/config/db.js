const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
})();

module.exports = sequelize;
