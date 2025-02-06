const { FunctionalRole } = require("../models/associations");

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
    res.json({ message: "Functional Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
