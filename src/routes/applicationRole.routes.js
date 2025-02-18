const express = require("express")
const router = express.Router()
const {
  getApplicationRoles,
  getApplicationRoleById,
  createApplicationRole,
  updateApplicationRole,
  deleteApplicationRole
} = require("../controllers/applicationRole.controller")

router.get("/", getApplicationRoles)
router.get("/:id", getApplicationRoleById)
router.post("/", createApplicationRole)
router.put("/:id", updateApplicationRole)
router.delete("/:id", deleteApplicationRole)

module.exports = router
