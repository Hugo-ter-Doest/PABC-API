const { FunctionalRole, TaskRole, Domain } = require("../models/associations");

exports.getFunctionalRolesDetails = async (req, res) => {
  try {
    const { functionalRoleIds } = req.body;

    if (!functionalRoleIds || !Array.isArray(functionalRoleIds)) {
      return res.status(400).json({ error: "Invalid input: functionalRoleIds must be an array of IDs" });
    }

    const functionalRoles = await FunctionalRole.findAll({
      where: { id: functionalRoleIds },
      include: [{ model: TaskRole, attributes: ["id", "name"] }]
    });

    if (!functionalRoles.length) {
      return res.status(404).json({ error: "No Functional Roles found" });
    }

    const results = await Promise.all(
      functionalRoles.map(async (functionalRole) => {
        // Get domains assigned to the Functional Role
        const domains = await functionalRole.getDomains();

        // Get all Entity Types from assigned Domains
        let accessibleEntityTypes = [];
        for (const domain of domains) {
          const entityTypes = await domain.getEntityTypes({ attributes: ["id", "name"] });
          accessibleEntityTypes = [...accessibleEntityTypes, ...entityTypes];
        }

        return {
          functionalRole: { id: functionalRole.id, name: functionalRole.name },
          taskRoles: functionalRole.TaskRoles,
          accessibleEntityTypes
        };
      })
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFunctionalRoles = async (req, res) => {
  try {
    const roles = await FunctionalRole.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFunctionalRoleById = async (req, res) => {
  try {
    const role = await FunctionalRole.findByPk(req.params.id);
    if (!role) return res.status(404).json({ error: "Functional Role not found" });

    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createFunctionalRole = async (req, res) => {
  try {
    const { name } = req.body;
    const role = await FunctionalRole.create({ name });
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateFunctionalRole = async (req, res) => {
  try {
    const { name } = req.body;
    const role = await FunctionalRole.findByPk(req.params.id);
    if (!role) return res.status(404).json({ error: "Functional Role not found" });

    role.name = name;
    await role.save();
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFunctionalRole = async (req, res) => {
  try {
    const role = await FunctionalRole.findByPk(req.params.id);
    if (!role) return res.status(404).json({ error: "Functional Role not found" });

    await role.destroy();
    return res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Assign Domains to a Functional Role
exports.assignDomainsToFunctionalRole = async (req, res) => {
  try {
    const { functionalRoleId } = req.params;
    const { domainIds } = req.body;

    // Check if Functional Role exists
    const functionalRole = await FunctionalRole.findByPk(functionalRoleId);
    if (!functionalRole) return res.status(404).json({ error: "Functional Role not found" });

    // Fetch Domains by given IDs
    const domains = await Domain.findAll({ where: { id: domainIds } });
    if (!domains.length) return res.status(400).json({ error: "No valid Domains found" });

    // Associate the Functional Role with the Domains
    await functionalRole.setDomains(domains);

    res.json({ message: "Domains assigned successfully", functionalRoleId, domains });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔵 Get Domains Assigned to a Functional Role
exports.getDomainsByFunctionalRole = async (req, res) => {
  try {
    const { functionalRoleId } = req.params;

    // Fetch Functional Role with associated Domains
    const functionalRole = await FunctionalRole.findByPk(functionalRoleId, {
      include: [{ model: Domain, attributes: ["id", "name"] }],
    });

    if (!functionalRole) return res.status(404).json({ error: "Functional Role not found" });

    res.json({ functionalRoleId, name: functionalRole.name, domains: functionalRole.Domains });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Assign Task Roles to a Functional Role
exports.assignTaskRolesToFunctionalRole = async (req, res) => {
  try {
    const { functionalRoleId } = req.params;
    const { taskRoleIds } = req.body;

    // Check if Functional Role exists
    const functionalRole = await FunctionalRole.findByPk(functionalRoleId);
    if (!functionalRole) return res.status(404).json({ error: "Functional Role not found" });

    // Fetch Task Roles by given IDs
    const taskRoles = await TaskRole.findAll({ where: { id: taskRoleIds } });
    if (!taskRoles.length) return res.status(400).json({ error: "No valid Task Roles found" });

    // Associate the Functional Role with the Task Roles
    await functionalRole.setTaskRoles(taskRoles);

    res.json({ message: "Task Roles assigned successfully", functionalRoleId, taskRoles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔵 Get Task Roles Assigned to a Functional Role
exports.getTaskRolesByFunctionalRole = async (req, res) => {
  try {
    const { functionalRoleId } = req.params;

    // Fetch Functional Role with associated Task Roles
    const functionalRole = await FunctionalRole.findByPk(functionalRoleId, {
      include: [{ model: TaskRole, attributes: ["id", "name"] }],
    });

    if (!functionalRole) return res.status(404).json({ error: "Functional Role not found" });

    res.json({ functionalRoleId, name: functionalRole.name, taskRoles: functionalRole.TaskRoles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
