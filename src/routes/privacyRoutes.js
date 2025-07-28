const express = require("express");
const router = express.Router();
const privacyController = require("../controllers/privacyController");

// Get privacy policy data
router.get("/", privacyController.getPrivacyPolicy);

// Save or update privacy policy data
router.put("/", privacyController.savePrivacyPolicy);

// Delete privacy policy data
router.delete("/:id", privacyController.deletePrivacyPolicy);

module.exports = router;