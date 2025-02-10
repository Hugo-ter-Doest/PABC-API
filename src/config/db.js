require("dotenv-flow").config(); // ⬅ Automatically loads the correct .env file
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  logging: process.env.NODE_ENV === "test" ? false : console.log, // Disable logging in tests
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
