const express = require("express")
const router = express.Router()
const {
  getFunctionalRoles,
  getFunctionalRoleByName,
  createFunctionalRole,
  updateFunctionalRole,
  deleteFunctionalRole
} = require("../controllers/functionalRole.controller")

router.get("/", getFunctionalRoles)
router.get("/:name", getFunctionalRoleByName)
router.post("/", createFunctionalRole)
router.put("/:name", updateFunctionalRole)
router.delete("/:name", deleteFunctionalRole)

module.exports = router
