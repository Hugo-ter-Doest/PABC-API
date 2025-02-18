const { ApplicationRole } = require("../models/associations");

exports.getApplicationRoles = async (req, res) => {
  try {
    const applicationRoles = await ApplicationRole.findAll()
    res.json(applicationRoles)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};

exports.getApplicationRoleById = async (req, res) => {
  try {
    const applicationRole = await ApplicationRole.findByPk(req.params.id)
    if (!applicationRole) return res.status(404).json({ error: "Application Role not found" })

    res.json(applicationRole)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};

exports.createApplicationRole = async (req, res) => {
  try {
    const { name, application } = req.body
    const applicationRole = await ApplicationRole.create({ name, application })
    res.status(201).json(applicationRole)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateApplicationRole = async (req, res) => {
  try {
    const { name } = req.body
    const applicationRole = await ApplicationRole.findByPk(req.params.id)
    if (!applicationRole) return res.status(404).json({ error: "Application Role not found" })

    applicationRole.name = name
    await applicationRole.save()
    res.json(applicationRole)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};

exports.deleteApplicationRole = async (req, res) => {
  try {
    const applicationRole = await ApplicationRole.findByPk(req.params.id)
    if (!applicationRole) return res.status(404).json({ error: "Application Role not found" })

    await applicationRole.destroy()
    res.status(204).json()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
