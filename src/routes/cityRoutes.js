const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");

// Get contact data
router.get("/:countryCode", cityController.getCities);

module.exports = router;
