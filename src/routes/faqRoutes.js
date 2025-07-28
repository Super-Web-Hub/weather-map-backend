const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faqController");

// Get all FAQs
router.get("/", faqController.getFAQs);

// Create or update an FAQ
router.put("/", faqController.saveFAQ);

// Delete an FAQ category
router.delete("/:id", faqController.deleteFAQ);

module.exports = router;