const { FunctionalRole, Domain } = require("../models/associations")

exports.getFunctionalRoles = async (req, res) => {
  try {
    const roles = await FunctionalRole.findAll()
    // Only return the names, not the UUID's
    res.json(roles.map( role => { role.name }))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getFunctionalRoleByName = async (req, res) => {
  try {
    const role = await FunctionalRole.findOne({ name: req.params.name })
    if (!role) return res.status(404).json({ error: "Functional Role not found" })

    res.json({
      name: role.name,
      application: role.application
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.createFunctionalRole = async (req, res) => {
  try {
    const { name } = req.body
    const role = await FunctionalRole.create({ name })
    res.status(201).json( {name: role.name} )
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateFunctionalRole = async (req, res) => {
  try {
    const { name } = req.body
    // console.log("Old name: ", req.params.name)
    // console.log("New name: ", name)
    const role = await FunctionalRole.findOne( {name: req.params.name} )
    if (!role) return res.status(404).json({ error: "Functional Role not found" })

    role.name = name
    await role.save()
    // Only return name, not the UUID
    res.json({ name: role.name })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.deleteFunctionalRole = async (req, res) => {
  try {
    const role = await FunctionalRole.findOne({ name: req.params.name })
    if (!role) return res.status(404).json({ error: "Functional Role not found" })

    // console.log("Inside delete functional role with: ", req.params.id)
    await role.destroy()
    return res.status(204).json()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
