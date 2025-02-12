const express = require("express");
const router = express.Router();
const {
  getTaskRoles,
  getTaskRoleById,
  createTaskRole,
  updateTaskRole,
  deleteTaskRole
} = require("../controllers/taskRole.controller");

router.get("/", getTaskRoles);
router.get("/:id", getTaskRoleById);
router.post("/", createTaskRole);
router.put("/:id", updateTaskRole);
router.delete("/:id", deleteTaskRole);

module.exports = router;
