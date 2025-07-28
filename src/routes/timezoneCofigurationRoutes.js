const express = require("express");
const timezoneConfigurationController = require("../controllers/timezoneConfigurationController");

const router = express.Router();

// Get all configurations
router.get("/", timezoneConfigurationController.getConfigurations);

// Get configuration by ID
router.get("/:id", timezoneConfigurationController.getConfiguration);

// Get configuration by user ID
router.get("/user/:userId", timezoneConfigurationController.getUserConfiguration);

// Create new configuration
router.post("/", timezoneConfigurationController.createConfiguration);

// Update configuration
router.put("/:id", timezoneConfigurationController.updateConfiguration);

// Delete configuration
router.delete("/:id", timezoneConfigurationController.deleteConfiguration);

module.exports = router;