const { FunctionalRole, Domain, FunctionalRoleDomain, TaskRole } = require("../models/associations");

// ✅ Create an association between a Functional Role and a Domain
exports.createFunctionalRoleDomain = async (req, res) => {
  try {
    const { functionalRoleId, domainId } = req.body;

    if (!functionalRoleId || !domainId) {
      return res.status(400).json({ error: "functionalRoleId and domainId are required" });
    }

    // ✅ Check if Functional Role and Domain exist
    const functionalRole = await FunctionalRole.findByPk(functionalRoleId);
    const domain = await Domain.findByPk(domainId);

    if (!functionalRole || !domain) {
      return res.status(404).json({ error: "Functional Role or Domain not found" });
    }

    // ✅ Prevent duplicate associations
    const [association, created] = await FunctionalRoleDomain.findOrCreate({
      where: { FunctionalRoleId: functionalRoleId, DomainId: domainId },
    });

    if (!created) {
      return res.status(400).json({ error: "Functional Role is already assigned to this Domain" });
    }

    // ✅ Explicitly include `functionalRoleId` and `domainId` in response
    res.status(201).json({
      id: association.id,
      functionalRoleId,
      domainId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/// Get all Functional Role-Domain associations
exports.getAllFunctionalRoleDomains = async (req, res) => {
  try {
    const associations = await FunctionalRoleDomain.findAll({
      include: [
        { model: FunctionalRole, attributes: ["id", "name"] },
        { model: Domain, attributes: ["id", "name"] }
      ],
    });
    res.json(associations);
  } catch (error) {
    console.error("❌ Server Error:", error); // ✅ This will show the actual problem
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
