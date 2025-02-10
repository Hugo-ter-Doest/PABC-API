const FunctionalRole = require("./functionalRole.model");
const TaskRole = require("./taskRole.model");
const Domain = require("./domain.model");
const EntityType = require("./entityType.model");

// Many-to-Many: Functional Roles <-> Task Roles
FunctionalRole.belongsToMany(TaskRole, { through: "FunctionalRoleTaskRole" });
TaskRole.belongsToMany(FunctionalRole, { through: "FunctionalRoleTaskRole" });

// Many-to-Many: Domains <-> Entity Types
Domain.belongsToMany(EntityType, { through: "DomainEntityType" });
EntityType.belongsToMany(Domain, { through: "DomainEntityType" });

// Many-to-Many: Functional Roles <-> Domains
FunctionalRole.belongsToMany(Domain, { through: "FunctionalRoleDomain" });
Domain.belongsToMany(FunctionalRole, { through: "FunctionalRoleDomain" });

module.exports = { FunctionalRole, TaskRole, Domain, EntityType };
