const { EntityType, Domain } = require("../models/associations");

exports.getEntityTypes = async (req, res) => {
  try {
    const entityTypes = await EntityType.findAll();
    res.json(entityTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEntityTypeById = async (req, res) => {
  try {
    const entityType = await EntityType.findByPk(req.params.id);
    if (!entityType) return res.status(404).json({ error: "Entity Type not found" });

    res.json(entityType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createEntityType = async (req, res) => {
  try {
    const { name } = req.body;
    const entityType = await EntityType.create({ name });
    res.status(201).json(entityType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEntityType = async (req, res) => {
  try {
    const { name } = req.body;
    const entityType = await EntityType.findByPk(req.params.id);
    if (!entityType) return res.status(404).json({ error: "Entity Type not found" });

    entityType.name = name;
    await entityType.save();
    res.json(entityType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEntityType = async (req, res) => {
  try {
    const entityType = await EntityType.findByPk(req.params.id);
    if (!entityType) return res.status(404).json({ error: "Entity Type not found" });

    await entityType.destroy();
    return res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔵 Get Domains Assigned to an Entity Type
exports.getDomainsByEntityType = async (req, res) => {
  try {
    const { entityTypeId } = req.params;

    // Fetch Entity Type with associated Domains
    const entityType = await EntityType.findByPk(entityTypeId, {
      include: [{ model: Domain, attributes: ["id", "name"] }],
    });

    if (!entityType) return res.status(404).json({ error: "Entity Type not found" });

    res.json({ entityTypeId, name: entityType.name, domains: entityType.Domains });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};