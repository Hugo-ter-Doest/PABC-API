const express = require("express");
const router = express.Router();
const {
  getEntityTypes,
  getEntityTypeById,
  createEntityType,
  updateEntityType,
  deleteEntityType,
} = require("../controllers/entityType.controller");

router.get("/", getEntityTypes);
router.get("/:id", getEntityTypeById);
router.post("/", createEntityType);
router.put("/:id", updateEntityType);
router.delete("/:id", deleteEntityType);

module.exports = router;
