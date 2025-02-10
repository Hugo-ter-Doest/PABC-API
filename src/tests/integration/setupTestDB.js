const { startServer } = require("../../server");
const sequelize = require("../../config/db");

let server;

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset test database
  server = await startServer(); // Start server once for tests
});

afterAll(async () => {
  await sequelize.close(); // Close DB connection
  server.close(); // Stop server after tests
});
