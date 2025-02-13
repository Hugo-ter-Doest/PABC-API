const FunctionalRole = require("./functionalRole.model");
const Domain = require("./domain.model");
const TaskRole = require("./taskRole.model");
const FunctionalRoleDomain = require("./functionalRoleDomain.model");
const EntityType = require("./entityType.model");


// 🔗 Many-to-One: FunctionalRole -> FunctionalRoleDomain
FunctionalRole.hasMany(FunctionalRoleDomain, { foreignKey: 'functionalRoleId' });

// 🔗 Many-to-One: Domain -> FunctionalRoleDomain
Domain.hasMany(FunctionalRoleDomain, { foreignKey: 'domainId' });

// 🔗 Many-to-One: FunctionalRoleDomain -> FunctionalRole
FunctionalRoleDomain.belongsTo(FunctionalRole, { foreignKey: 'functionalRoleId' });

// 🔗 Many-to-One: FunctionalRoleDomain -> Domain
FunctionalRoleDomain.belongsTo(Domain, { foreignKey: 'domainId' });

// 🔗 Many-to-Many: FunctionalRoleDomain <-> TaskRole
FunctionalRoleDomain.belongsToMany(TaskRole, { through: "FunctionalRoleDomainTaskRoles" });
TaskRole.belongsToMany(FunctionalRoleDomain, { through: "FunctionalRoleDomainTaskRoles" });

// 🔗 Many-to-Many: Domains <-> Entity Types (No change)
Domain.belongsToMany(EntityType, { through: "DomainEntityType" });
EntityType.belongsToMany(Domain, { through: "DomainEntityType" });

module.exports = { FunctionalRole, Domain, TaskRole, FunctionalRoleDomain, EntityType };
