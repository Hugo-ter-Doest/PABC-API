const express = require("express")
const router = express.Router()
const {
  getApplicationRoles,
  getApplicationRoleByName,
  createApplicationRole,
  updateApplicationRole,
  deleteApplicationRole
} = require("../controllers/applicationRole.controller")

router.get("/", getApplicationRoles)
router.get("/:name", getApplicationRoleByName)
router.post("/", createApplicationRole)
router.put("/:name", updateApplicationRole)
router.delete("/:name", deleteApplicationRole)

module.exports = router
