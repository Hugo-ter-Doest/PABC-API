const { Domain, EntityType } = require("../models/associations")

exports.getDomains = async (req, res) => {
  try {
    const domains = await Domain.findAll()
    res.json(domains)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getDomainById = async (req, res) => {
  try {
    const domain = await Domain.findByPk(req.params.id)
    if (!domain) return res.status(404).json({ error: "Domain not found" })

    res.json(domain)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.createDomain = async (req, res) => {
  try {
    const { name } = req.body
    const domain = await Domain.create({ name })
    res.status(201).json(domain)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateDomain = async (req, res) => {
  try {
    const { name } = req.body
    const domain = await Domain.findByPk(req.params.id)
    if (!domain) return res.status(404).json({ error: "Domain not found" })

    domain.name = name
    await domain.save()
    res.json(domain)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.deleteDomain = async (req, res) => {
  try {
    const domain = await Domain.findByPk(req.params.id)
    if (!domain) return res.status(404).json({ error: "Domain not found" })

    await domain.destroy()
    res.json({ message: "Domain deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 🟢 Assign Entity Types to a Domain
exports.assignEntityTypesToDomain = async (req, res) => {
  try {
    const { domainId } = req.params
    const { entityTypeIds } = req.body

    // Check if Domain exists
    const domain = await Domain.findByPk(domainId)
    if (!domain) return res.status(404).json({ error: "Domain not found" })

    // Fetch Entity Types by given IDs
    const entityTypes = await EntityType.findAll({ where: { id: entityTypeIds } })
    if (!entityTypes.length) return res.status(400).json({ error: "No valid Entity Types found" })

    // Associate the Domain with the Entity Types
    await domain.setEntityTypes(entityTypes)

    res.json({ message: "Entity Types assigned successfully", domainId, entityTypes })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 🔵 Get Entity Types Assigned to a Domain
exports.getEntityTypesByDomain = async (req, res) => {
  try {
    const { domainId } = req.params

    // Fetch Domain with associated Entity Types
    const domain = await Domain.findByPk(domainId, {
      include: [{ model: EntityType, attributes: ["id", "name"] }],
    })

    if (!domain) return res.status(404).json({ error: "Domain not found" })

    res.json({ domainId, entityTypes: domain.EntityTypes })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
