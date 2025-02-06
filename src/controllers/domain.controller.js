const { Domain } = require("../models/associations");

exports.getDomains = async (req, res) => {
  try {
    const domains = await Domain.findAll();
    res.json(domains);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDomainById = async (req, res) => {
  try {
    const domain = await Domain.findByPk(req.params.id);
    if (!domain) return res.status(404).json({ error: "Domain not found" });

    res.json(domain);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createDomain = async (req, res) => {
  try {
    const { name } = req.body;
    const domain = await Domain.create({ name });
    res.status(201).json(domain);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDomain = async (req, res) => {
  try {
    const { name } = req.body;
    const domain = await Domain.findByPk(req.params.id);
    if (!domain) return res.status(404).json({ error: "Domain not found" });

    domain.name = name;
    await domain.save();
    res.json(domain);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDomain = async (req, res) => {
  try {
    const domain = await Domain.findByPk(req.params.id);
    if (!domain) return res.status(404).json({ error: "Domain not found" });

    await domain.destroy();
    res.json({ message: "Domain deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
