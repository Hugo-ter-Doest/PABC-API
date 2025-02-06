require("dotenv").config();
const express = require("express");
const setupSwagger = require("./swagger");
const sequelize = require("./config/db");
const functionalRoleRoutes = require("./routes/functionalRole.routes");
const domainRoutes = require("./routes/domain.routes");
const taskRoleRoutes = require("./routes/taskRole.routes");
const entityTypeRoutes = require("./routes/entityType.routes");

const app = express();
app.use(express.json());
setupSwagger(app);

app.use("/api/functionalRoles", functionalRoleRoutes);
app.use("/api/domains", domainRoutes);
app.use("/api/taskRoles", taskRoleRoutes);
app.use("/api/entityTypes", entityTypeRoutes);

sequelize.sync().then(() => {
  app.listen(5000, () => console.log("🚀 Server running on port 5000"));
});
