const { startServer } = require("../../server")
const sequelize = require("../../config/db")

let server

beforeAll(async () => {
  await sequelize.sync({ force: true })
  server = await startServer()
});

afterAll(async () => {
  await sequelize.close()
  server.close()
})
