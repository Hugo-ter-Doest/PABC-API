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
