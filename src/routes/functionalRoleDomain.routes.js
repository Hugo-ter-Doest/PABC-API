const express = require("express")
const router = express.Router()
const {
  createFunctionalRoleDomain,
  getAllFunctionalRoleDomains,
  assignApplicationRolesToFunctionalRoleDomain,
  getApplicationRolesForFunctionalRoleDomain,
  getAllowedApplicationRolesAndEntityTypes,
} = require("../controllers/functionalRoleDomain.controller")

// Create a Functional Role-Domain association
router.post("/", createFunctionalRoleDomain)

// Get all Functional Role-Domain associations
router.get("/", getAllFunctionalRoleDomains)

// Assign Task Roles to a Functional Role-Domain association
router.post("/:functionalRoleDomainId/applicationRoles", assignApplicationRolesToFunctionalRoleDomain)

// Get Task Roles assigned to a Functional Role-Domain association
router.get("/:functionalRoleDomainId/applicationRoles", getApplicationRolesForFunctionalRoleDomain)

router.post("/getAccessRights", getAllowedApplicationRolesAndEntityTypes)
module.exports = router
