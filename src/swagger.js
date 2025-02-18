const swaggerUi = require("swagger-ui-express")
const YAML = require("yamljs")
const swaggerDocument = YAML.load("./src/docs/swagger.yaml")

module.exports = (app) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}
