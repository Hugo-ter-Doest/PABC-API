const express = require("express");
const router = express.Router();
const {
  getTaskRoles,
  getTaskRoleById,
  createTaskRole,
  updateTaskRole,
  deleteTaskRole,
  getFunctionalRolesByTaskRole
} = require("../controllers/taskRole.controller");

router.get("/", getTaskRoles);
router.get("/:id", getTaskRoleById);
router.post("/", createTaskRole);
router.put("/:id", updateTaskRole);
router.delete("/:id", deleteTaskRole);
// Route to retrieve Functional Roles assigned to a Task Role
router.get("/:taskRoleId/functionalRoles", getFunctionalRolesByTaskRole);

module.exports = router;
