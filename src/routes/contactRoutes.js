const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

// Get contact data
router.get("/", contactController.getContactData);

// Update contact data
router.put("/", contactController.updateContactData);

// Create contact data (only needed if the row doesn't exist)
router.post("/", contactController.createContactData);

module.exports = router;