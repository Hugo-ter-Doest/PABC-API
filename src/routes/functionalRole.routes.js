const express = require("express");
const router = express.Router();
const {
  getFunctionalRoles,
  getFunctionalRoleById,
  createFunctionalRole,
  updateFunctionalRole,
  deleteFunctionalRole,
  getFunctionalRolesDetails,
  assignDomainsToFunctionalRole,
  getDomainsByFunctionalRole,
  assignTaskRolesToFunctionalRole,
  getTaskRolesByFunctionalRole
} = require("../controllers/functionalRole.controller");

router.get("/", getFunctionalRoles);
router.get("/:id", getFunctionalRoleById);
router.post("/", createFunctionalRole);
router.put("/:id", updateFunctionalRole);
router.delete("/:id", deleteFunctionalRole);
router.post("/details", getFunctionalRolesDetails);
// Route to assign Domains to a Functional Role
router.post("/:functionalRoleId/domains", assignDomainsToFunctionalRole);
// Route to retrieve Domains assigned to a Functional Role
router.get("/:functionalRoleId/domains", getDomainsByFunctionalRole);
// Route to assign Task Roles to a Functional Role
router.post("/:functionalRoleId/taskRoles", assignTaskRolesToFunctionalRole);
// Route to retrieve Task Roles assigned to a Functional Role
router.get("/:functionalRoleId/taskRoles", getTaskRolesByFunctionalRole);

module.exports = router;
