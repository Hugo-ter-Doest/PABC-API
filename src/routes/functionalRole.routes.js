const express = require("express");
const router = express.Router();
const {
  getFunctionalRoles,
  getFunctionalRoleById,
  createFunctionalRole,
  updateFunctionalRole,
  deleteFunctionalRole,
} = require("../controllers/functionalRole.controller");

router.get("/", getFunctionalRoles);
router.get("/:id", getFunctionalRoleById);
router.post("/", createFunctionalRole);
router.put("/:id", updateFunctionalRole);
router.delete("/:id", deleteFunctionalRole);

module.exports = router;
