// require("dotenv").config();
const express = require("express");
const setupSwagger = require("./swagger");
const sequelize = require("./config/db");
const functionalRoleRoutes = require("./routes/functionalRole.routes");
const domainRoutes = require("./routes/domain.routes");
const applicationRoleRoutes = require("./routes/applicationRole.routes");
const entityTypeRoutes = require("./routes/entityType.routes");
const functionalRoleDomainRoutes = require("./routes/functionalRoleDomain.routes");

require("dotenv-flow").config();

const app = express();
app.use(express.json());
setupSwagger(app);

app.use("/api/functionalRoles", functionalRoleRoutes);
app.use("/api/domains", domainRoutes);
app.use("/api/applicationRoles", applicationRoleRoutes);
app.use("/api/entityTypes", entityTypeRoutes);
app.use("/api/functionalRoleDomains", functionalRoleDomainRoutes);

let server; // Declare server instance

// Function to start the server
const startServer = async () => {
  try {
    await sequelize.sync({ alter: true }); // Ensure DB sync
    const PORT = process.env.PORT || 5000;
    return app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
};

// Start the server normally if not in test mode
if (process.env.NODE_ENV !== "test") {
  startServer();
}

module.exports = { app, startServer };