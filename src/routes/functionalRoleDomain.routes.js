const express = require("express");
const router = express.Router();
const {
  assignFunctionalRoleToDomain,
  assignTaskRolesToFunctionalRoleDomain,
  getTaskRolesForFunctionalRoleDomain,
} = require("../controllers/functionalRoleDomain.controller");

// Assign Functional Role to Domain (create the association)
router.post("/:functionalRoleId/domains/:domainId", assignFunctionalRoleToDomain);

// Assign Task Roles to a Functional Role-Domain pair
router.post("/:functionalRoleDomainId/taskRoles", assignTaskRolesToFunctionalRoleDomain);

// Get Task Roles for a Functional Role-Domain pair
router.get("/:functionalRoleDomainId/taskRoles", getTaskRolesForFunctionalRoleDomain);

module.exports = router;
