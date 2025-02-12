const { FunctionalRole, Domain, FunctionalRoleDomain, TaskRole } = require("../models/associations");

// Assign Functional Role to Domain (creates a linking record)
exports.assignFunctionalRoleToDomain = async (req, res) => {
  try {
    const { functionalRoleId, domainId } = req.params;

    const functionalRole = await FunctionalRole.findByPk(functionalRoleId);
    const domain = await Domain.findByPk(domainId);

    if (!functionalRole || !domain) {
      return res.status(404).json({ error: "Functional Role or Domain not found" });
    }

    const [link, created] = await FunctionalRoleDomain.findOrCreate({
      where: { FunctionalRoleId: functionalRoleId, DomainId: domainId },
    });

    res.json({ message: "Functional Role assigned to Domain", link, created });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Assign Task Roles to a Functional Role & Domain
exports.assignTaskRolesToFunctionalRoleDomain = async (req, res) => {
  try {
    const { functionalRoleDomainId } = req.params;
    const { taskRoleIds } = req.body; // Array of Task Role IDs

    const link = await FunctionalRoleDomain.findByPk(functionalRoleDomainId);

    if (!link) {
      return res.status(404).json({ error: "Functional Role-Domain association not found" });
    }

    const taskRoles = await TaskRole.findAll({ where: { id: taskRoleIds } });

    if (taskRoles.length === 0) {
      return res.status(400).json({ error: "No valid Task Roles found" });
    }

    await link.setTaskRoles(taskRoles);

    res.json({ message: "Task Roles assigned successfully", functionalRoleDomainId, taskRoles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Task Roles for a Functional Role & Domain
exports.getTaskRolesForFunctionalRoleDomain = async (req, res) => {
  try {
    const { functionalRoleDomainId } = req.params;

    const link = await FunctionalRoleDomain.findByPk(functionalRoleDomainId, {
      include: { model: TaskRole, attributes: ["id", "name"] },
    });

    if (!link) {
      return res.status(404).json({ error: "Functional Role-Domain association not found" });
    }

    res.json({ functionalRoleDomainId, taskRoles: link.TaskRoles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get allowed task roles and entity types for a list of functional roles
exports.getAllowedTaskRolesAndEntityTypes = async (req, res) => {
  try {
    const { functionalRoleIds } = req.body; // List of functional role IDs

    if (!functionalRoleIds || !Array.isArray(functionalRoleIds) || functionalRoleIds.length === 0) {
      return res.status(400).json({ error: "functionalRoleIds must be a non-empty array" });
    }

    // Find all FunctionalRoleDomain associations that match the given Functional Role IDs
    const functionalRoleDomains = await FunctionalRoleDomain.findAll({
      where: { FunctionalRoleId: functionalRoleIds },
      include: [
        { model: TaskRole, attributes: ["id", "name"] },
        {
          model: Domain,
          attributes: ["id", "name"],
          include: { model: EntityType, attributes: ["id", "name"] }, // Get associated Entity Types
        },
      ],
    });

    // Transform the data into a list of objects with task roles and entity types
    const result = functionalRoleDomains.map((frd) => ({
      taskRoles: frd.TaskRoles,
      entityTypes: frd.Domain.EntityTypes,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
