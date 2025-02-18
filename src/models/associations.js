const FunctionalRole = require("./functionalRole.model")
const Domain = require("./domain.model")
const ApplicationRole = require("./applicationRole.model")
const FunctionalRoleDomain = require("./functionalRoleDomain.model")
const EntityType = require("./entityType.model")

// Many-to-One: FunctionalRole -> FunctionalRoleDomain
FunctionalRole.hasMany(FunctionalRoleDomain, { foreignKey: 'functionalRoleId' })

// Many-to-One: Domain -> FunctionalRoleDomain
Domain.hasMany(FunctionalRoleDomain, { foreignKey: 'domainId' })

// Many-to-One: FunctionalRoleDomain -> FunctionalRole
FunctionalRoleDomain.belongsTo(FunctionalRole, { foreignKey: 'functionalRoleId' })

// Many-to-One: FunctionalRoleDomain -> Domain
FunctionalRoleDomain.belongsTo(Domain, { foreignKey: 'domainId' })

// Many-to-Many: FunctionalRoleDomain <-> ApplicationRole
FunctionalRoleDomain.belongsToMany(ApplicationRole, { through: "FunctionalRoleDomainApplicationRoles" })
ApplicationRole.belongsToMany(FunctionalRoleDomain, { through: "FunctionalRoleDomainApplicationRoles" })

// Many-to-Many: Domains <-> Entity Types
Domain.belongsToMany(EntityType, { through: "DomainEntityType" })
EntityType.belongsToMany(Domain, { through: "DomainEntityType" })

module.exports = { FunctionalRole, Domain, ApplicationRole, FunctionalRoleDomain, EntityType }
