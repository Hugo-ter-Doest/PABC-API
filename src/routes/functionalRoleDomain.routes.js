const express = require("express")
const router = express.Router()
const {
  createFunctionalRoleDomain,
  deleteFunctionalRoleDomain,
  getAllFunctionalRoleDomains,
  assignApplicationRolesToFunctionalRoleDomain,
  getApplicationRolesForFunctionalRoleDomain,
  getAllowedApplicationRolesAndEntityTypes,
  getEntityTypesPerApplicationRole,
  getApplicationRolesPerEntityType
} = require("../controllers/functionalRoleDomain.controller")

// Create a Functional Role-Domain association
router.post("/", createFunctionalRoleDomain)

// Delete a Functional Role-Domain association
router.delete("/:id", deleteFunctionalRoleDomain)

// Get all Functional Role-Domain associations
router.get("/", getAllFunctionalRoleDomains)

// Assign Task Roles to a Functional Role-Domain association
router.post("/:functionalRoleDomainId/applicationRoles", assignApplicationRolesToFunctionalRoleDomain)

// Get Task Roles assigned to a Functional Role-Domain association
router.get("/:functionalRoleDomainId/applicationRoles", getApplicationRolesForFunctionalRoleDomain)

// 🔹 Top-level routes
router.post("/getAccessRights", getAllowedApplicationRolesAndEntityTypes)
router.post("/getEntityTypesPerApplicationRole", getEntityTypesPerApplicationRole);
router.post("/getApplicationRolesPerEntityType", getApplicationRolesPerEntityType);

module.exports = router
