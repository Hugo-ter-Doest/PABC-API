const express = require("express")
const router = express.Router()
const {
  getFunctionalRoles,
  getFunctionalRoleById,
  createFunctionalRole,
  updateFunctionalRole,
  deleteFunctionalRole,
  assignDomainsToFunctionalRole,
  getDomainsByFunctionalRole
} = require("../controllers/functionalRole.controller")

router.get("/", getFunctionalRoles)
router.get("/:id", getFunctionalRoleById)
router.post("/", createFunctionalRole)
router.put("/:id", updateFunctionalRole)
router.delete("/:id", deleteFunctionalRole)
// Route to assign Domains to a Functional Role
router.post("/:functionalRoleId/domains", assignDomainsToFunctionalRole)
// Route to retrieve Domains assigned to a Functional Role
router.get("/:functionalRoleId/domains", getDomainsByFunctionalRole)

module.exports = router
