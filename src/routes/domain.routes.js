const express = require("express");
const router = express.Router();
const {
  getDomains,
  getDomainById,
  createDomain,
  updateDomain,
  deleteDomain,
} = require("../controllers/domain.controller");

router.get("/", getDomains);
router.get("/:id", getDomainById);
router.post("/", createDomain);
router.put("/:id", updateDomain);
router.delete("/:id", deleteDomain);

module.exports = router;
