const express = require("express");
const planController = require("../controllers/planController");

const router = express.Router();

router.get("/:id", planController.getPlan);
router.get("/", planController.getPlans);
router.post("/", planController.createPlan);
router.put("/:id", planController.updatePlan);
router.delete("/:id", planController.deletePlan);
router.get("/featuers", planController.getPlanFeatures);

module.exports = router;
