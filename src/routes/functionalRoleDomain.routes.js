const express = require("express");
const router = express.Router();
const {
  createFunctionalRoleDomain,
  getAllFunctionalRoleDomains,
  assignTaskRolesToFunctionalRoleDomain,
  getTaskRolesForFunctionalRoleDomain,
  getAllowedTaskRolesAndEntityTypes,
} = require("../controllers/functionalRoleDomain.controller");

// Create a Functional Role-Domain association
router.post("/", createFunctionalRoleDomain);

// Get all Functional Role-Domain associations
router.get("/", getAllFunctionalRoleDomains);

// Assign Task Roles to a Functional Role-Domain association
router.post("/:functionalRoleDomainId/taskRoles", assignTaskRolesToFunctionalRoleDomain);

// Get Task Roles assigned to a Functional Role-Domain association
router.get("/:functionalRoleDomainId/taskRoles", getTaskRolesForFunctionalRoleDomain);

router.post("/getAccessRights", getAllowedTaskRolesAndEntityTypes);
module.exports = router;
