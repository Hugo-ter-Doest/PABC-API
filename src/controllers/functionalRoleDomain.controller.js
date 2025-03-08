const { Op } = require('sequelize')
const { FunctionalRole, Domain, FunctionalRoleDomain, ApplicationRole, EntityType } = require("../models/associations")

// Create an association between a Functional Role and a Domain
exports.createFunctionalRoleDomain = async (req, res) => {
  try {
    const { functionalRoleId, domainId } = req.body

    if (!functionalRoleId || !domainId) {
      return res.status(400).json({ error: "functionalRoleId and domainId are required" })
    }

    // Check if Functional Role and Domain exist
    const functionalRole = await FunctionalRole.findByPk(functionalRoleId)
    const domain = await Domain.findByPk(domainId)

    if (!functionalRole || !domain) {
      return res.status(404).json({ error: "Functional Role or Domain not found" })
    }

    // Prevent duplicate associations
    const [association, created] = await FunctionalRoleDomain.findOrCreate({
      where: { functionalRoleId: functionalRoleId, domainId: domainId },
    })

    if (!created) {
      return res.status(400).json({ error: "Functional Role is already assigned to this Domain" })
    }

    // Explicitly include `functionalRoleId` and `domainId` in response
    res.status(201).json({
      id: association.id,
      functionalRoleId,
      domainId,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Delete a Functional Role-Domain association
exports.deleteFunctionalRoleDomain = async (req, res) => {
  try {
    const id = req.params.id
    console.log(id)
    const association = await FunctionalRoleDomain.findByPk(id)
    console.log(association)
    if (!association) {
      return res.status(404).json({ error: 'Association not found' })
    }
    await association.destroy()
    res.status(204).json({ message: 'Association deleted successfully' })
  } catch (error) {
    console.error('Error deleting association:', error)
    res.status(500).json({ error: 'Error deleting association' })
  }
}

// Get all Functional Role-Domain associations
exports.getAllFunctionalRoleDomains = async (req, res) => {
  try {
    const associations = await FunctionalRoleDomain.findAll({
      include: [
        { model: FunctionalRole, attributes: ["id", "name"] },
        { model: Domain, attributes: ["id", "name"] }
      ],
    })
    res.json(associations)
  } catch (error) {
    console.error("❌ Server Error:", error) // ✅ This will show the actual problem
    res.status(500).json({ error: error.message })
  }
}

// Assign Application Roles to a Functional Role & Domain
exports.assignApplicationRolesToFunctionalRoleDomain = async (req, res) => {
  try {
    const { functionalRoleDomainId } = req.params
    const { applicationRoleIds } = req.body // Array of Application Role IDs

    const link = await FunctionalRoleDomain.findByPk(functionalRoleDomainId)

    if (!link) {
      return res.status(404).json({ error: "Functional Role-Domain association not found" })
    }

    const applicationRoles = await ApplicationRole.findAll({ where: { id: applicationRoleIds } })

    if (applicationRoles.length === 0) {
      return res.status(400).json({ error: "No valid Application Roles found" })
    }

    await link.setApplicationRoles(applicationRoles)

    res.json({ message: "Application Roles assigned successfully", functionalRoleDomainId, applicationRoles })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get Application Roles for a Functional Role & Domain
exports.getApplicationRolesForFunctionalRoleDomain = async (req, res) => {
  try {
    const { functionalRoleDomainId } = req.params

    const link = await FunctionalRoleDomain.findByPk(functionalRoleDomainId, {
      include: { model: ApplicationRole, attributes: ["id", "name"] },
    })

    if (!link) {
      return res.status(404).json({ error: "Functional Role-Domain association not found" })
    }

    res.json({ functionalRoleDomainId, applicationRoles: link.ApplicationRoles })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get allowed application roles and entity types for a list of functional roles
exports.getAllowedApplicationRolesAndEntityTypes = async (req, res) => {
  try {
    const { functionalRoleIds } = req.body // List of functional role IDs
    // console.log('functionalRoleIds: ', functionalRoleIds)

    if (!functionalRoleIds || !Array.isArray(functionalRoleIds) || functionalRoleIds.length === 0) {
      return res.status(400).json({ error: "functionalRoleIds must be a non-empty array" })
    }

    // Find all FunctionalRoleDomain associations that match the given Functional Role IDs
    const functionalRoleDomains = await FunctionalRoleDomain.findAll({
      where: { 
        functionalRoleId: {
          [Op.in]: functionalRoleIds
        }
      },
      include: [
        {
          model: FunctionalRole,
          attributes: ["id", "name"],
        },
        {
          model: Domain,
          attributes: ["id", "name"],
          include: [
            {
              model: EntityType,
              attributes: ["id", "name"],
            },
          ]
        },
        {
          model: ApplicationRole,
          attributes: ["id", "name"],
        },
      ],
    })
    // console.log('functionalRoleDomains: ', JSON.stringify(functionalRoleDomains, null, 2))

    // let results = []
    // Transform the data into a list of objects with application roles and entity types
    result = functionalRoleDomains.map((frd) => {
      return {
        functionalRoleDomainId: frd.id,
        functionalRole: frd.FunctionalRole,
        domain: {
          id: frd.Domain.id,
          name: frd.Domain.name,
        },
        applicationRoles: frd.ApplicationRoles ? frd.ApplicationRoles.map((ar) => {
          return {
            id: ar.id,
            name: ar.name,
            application: ar.application
          }
        }) : [],        
        entityTypes: frd.Domain.EntityTypes ? frd.Domain.EntityTypes.map((et) => {
          return {
            id: et.id,
            name: et.name,
          }
        }) : [],      
      }
    })

    res.json(result)
  } catch (error) {
    console.log('Error: ', error.message)
    res.status(500).json({ error: error.message })
  }
}

exports.getEntityTypesPerApplicationRole = async (req, res) => {
  try {
    const { functionalRoleIds } = req.body;

    if (!functionalRoleIds || !Array.isArray(functionalRoleIds) || functionalRoleIds.length === 0) {
      return res.status(400).json({ error: "functionalRoleIds must be a non-empty array" });
    }

    const functionalRoleDomains = await FunctionalRoleDomain.findAll({
      where: {
        functionalRoleId: {
          [Op.in]: functionalRoleIds,
        },
      },
      attributes: ["id"],
      include: [
        {
          model: Domain,
          attributes: ["id", "name"],
          include: [
            {
              model: EntityType,
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: ApplicationRole,
          attributes: ["id", "name"],
        },
      ],
    });

    const applicationRoleToEntityTypes = new Map();

    for (const frd of functionalRoleDomains) {
      const entityTypes = frd.Domain?.EntityTypes || [];
      const applicationRoles = frd.ApplicationRoles || [];

      for (const appRole of applicationRoles) {
        if (!applicationRoleToEntityTypes.has(appRole.id)) {
          applicationRoleToEntityTypes.set(appRole.id, {
            id: appRole.id,
            name: appRole.name,
            entityTypes: [],
          });
        }
        entityTypes.forEach((et) => {
          applicationRoleToEntityTypes.get(appRole.id).entityTypes.push({
            id: et.id,
            name: et.name,
          });
        });
      }
    }

    res.json(Array.from(applicationRoleToEntityTypes.values()));
  } catch (error) {
    console.error("Error in getEntityTypesPerApplicationRole:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getApplicationRolesPerEntityType = async (req, res) => {
  try {
    const { functionalRoleIds } = req.body;

    if (!functionalRoleIds || !Array.isArray(functionalRoleIds) || functionalRoleIds.length === 0) {
      return res.status(400).json({ error: "functionalRoleIds must be a non-empty array" });
    }

    const functionalRoleDomains = await FunctionalRoleDomain.findAll({
      where: {
        functionalRoleId: {
          [Op.in]: functionalRoleIds,
        },
      },
      attributes: ["id"],
      include: [
        {
          model: Domain,
          attributes: ["id", "name"],
          include: [
            {
              model: EntityType,
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: ApplicationRole,
          attributes: ["id", "name"],
        },
      ],
    });

    const entityTypeToApplicationRoles = new Map();

    for (const frd of functionalRoleDomains) {
      const entityTypes = frd.Domain?.EntityTypes || [];
      const applicationRoles = frd.ApplicationRoles || [];

      for (const et of entityTypes) {
        if (!entityTypeToApplicationRoles.has(et.id)) {
          entityTypeToApplicationRoles.set(et.id, {
            id: et.id,
            name: et.name,
            applicationRoles: [],
          });
        }
        applicationRoles.forEach((appRole) => {
          entityTypeToApplicationRoles.get(et.id).applicationRoles.push({
            id: appRole.id,
            name: appRole.name,
          });
        });
      }
    }

    res.json(Array.from(entityTypeToApplicationRoles.values()));
  } catch (error) {
    console.error("Error in getApplicationRolesPerEntityType:", error);
    res.status(500).json({ error: error.message });
  }
};
