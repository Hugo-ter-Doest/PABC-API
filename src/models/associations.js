const FunctionalRole = require("./functionalRole.model");
const Domain = require("./domain.model");
const TaskRole = require("./taskRole.model");
const FunctionalRoleDomain = require("./functionalRoleDomain.model");
const EntityType = require("./entityType.model");

// 🔗 Many-to-Many: FunctionalRole <-> Domain (via FunctionalRoleDomain)
FunctionalRole.belongsToMany(Domain, { through: FunctionalRoleDomain });
Domain.belongsToMany(FunctionalRole, { through: FunctionalRoleDomain });

// 🔗 Many-to-Many: FunctionalRoleDomain <-> TaskRole
FunctionalRoleDomain.belongsToMany(TaskRole, { through: "FunctionalRoleDomainTaskRoles" });
TaskRole.belongsToMany(FunctionalRoleDomain, { through: "FunctionalRoleDomainTaskRoles" });

// 🔗 Many-to-Many: Domains <-> Entity Types (No change)
Domain.belongsToMany(EntityType, { through: "DomainEntityType" });
EntityType.belongsToMany(Domain, { through: "DomainEntityType" });

module.exports = { FunctionalRole, Domain, TaskRole, FunctionalRoleDomain, EntityType };
