const { TaskRole } = require("../models/associations");

exports.getTaskRoles = async (req, res) => {
  try {
    const taskRoles = await TaskRole.findAll();
    res.json(taskRoles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTaskRoleById = async (req, res) => {
  try {
    const taskRole = await TaskRole.findByPk(req.params.id);
    if (!taskRole) return res.status(404).json({ error: "Task Role not found" });

    res.json(taskRole);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTaskRole = async (req, res) => {
  try {
    const { name } = req.body;
    const taskRole = await TaskRole.create({ name });
    res.status(201).json(taskRole);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTaskRole = async (req, res) => {
  try {
    const { name } = req.body;
    const taskRole = await TaskRole.findByPk(req.params.id);
    if (!taskRole) return res.status(404).json({ error: "Task Role not found" });

    taskRole.name = name;
    await taskRole.save();
    res.json(taskRole);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTaskRole = async (req, res) => {
  try {
    const taskRole = await TaskRole.findByPk(req.params.id);
    if (!taskRole) return res.status(404).json({ error: "Task Role not found" });

    await taskRole.destroy();
    res.json({ message: "Task Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
