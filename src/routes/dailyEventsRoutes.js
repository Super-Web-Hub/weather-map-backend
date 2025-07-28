const express = require("express");
const router = express.Router();
const dailyEventsController = require("../controllers/dailyEventsController");

// Get contact data
router.get("/", dailyEventsController.getDailyEvents);

// Update contact data
// router.put("/", contactController.updateContactData);

// // Create contact data (only needed if the row doesn't exist)
// router.post("/", contactController.createContactData);

module.exports = router;