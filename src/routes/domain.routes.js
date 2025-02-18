const express = require("express")
const router = express.Router()
const {
  getDomains,
  getDomainById,
  createDomain,
  updateDomain,
  deleteDomain,
  assignEntityTypesToDomain,
  getEntityTypesByDomain
} = require("../controllers/domain.controller")

router.get("/", getDomains)
router.get("/:id", getDomainById)
router.post("/", createDomain)
router.put("/:id", updateDomain)
router.delete("/:id", deleteDomain)
// Route to assign Entity Types to a Domain
router.post("/:domainId/entityTypes", assignEntityTypesToDomain)
// Route to retrieve Entity Types assigned to a Domain
router.get("/:domainId/entityTypes", getEntityTypesByDomain)

module.exports = router
