const { ApplicationRole } = require("../models/associations");
const { app } = require("../server");

exports.getApplicationRoles = async (req, res) => {
  try {
    const applicationRoles = await ApplicationRole.findAll()
    res.json(applicationRoles.map( role => { role.name }))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};

exports.getApplicationRoleByName = async (req, res) => {
  try {
    const applicationRole = await ApplicationRole.findOne({ name: req.params.name })
    if (!applicationRole) return res.status(404).json({ error: "Application Role not found" })

    res.json({
      name: applicationRole.name,
      application: applicationRole.application
  })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};

exports.createApplicationRole = async (req, res) => {
  try {
    const { name, application } = req.body
    const applicationRole = await ApplicationRole.create({ name, application })
    res.status(201).json({
      name: applicationRole.name,
      application: applicationRole.application
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateApplicationRole = async (req, res) => {
  try {
    const { name } = req.body
    const applicationRole = await ApplicationRole.findOne( {name: req.params.name} )
    if (!applicationRole) return res.status(404).json({ error: "Application Role not found" })

    applicationRole.name = name
    await applicationRole.save()
    res.json({
      name: applicationRole.name,
      application: applicationRole.application
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};

exports.deleteApplicationRole = async (req, res) => {
  try {
    const applicationRole = await ApplicationRole.findOne( {name: req.params.name})
    if (!applicationRole) return res.status(404).json({ error: "Application Role not found" })

    await applicationRole.destroy()
    res.status(204).json()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
