const express = require("express");
const router = express.Router();
const {
  assignFunctionalRoleToDomain,
  assignTaskRolesToFunctionalRoleDomain,
  getTaskRolesForFunctionalRoleDomain,
  getAllowedTaskRolesAndEntityTypes
} = require("../controllers/functionalRoleDomain.controller");

// Assign Functional Role to Domain (create the association)
router.post("/:functionalRoleId/domains/:domainId", assignFunctionalRoleToDomain);

// Assign Task Roles to a Functional Role-Domain pair
router.post("/:functionalRoleDomainId/taskRoles", assignTaskRolesToFunctionalRoleDomain);

// Get Task Roles for a Functional Role-Domain pair
router.get("/:functionalRoleDomainId/taskRoles", getTaskRolesForFunctionalRoleDomain);

// Get allowed (Task Role, Entity Types) pairs for a list of Functional Roles
router.post("/get-access-rights", getAllowedTaskRolesAndEntityTypes);

module.exports = router;
