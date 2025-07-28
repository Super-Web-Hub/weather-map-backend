const express = require("express");
const userMapPinController = require("../controllers/userMapPinController");

const router = express.Router();

// Get all map pins
router.get("/", userMapPinController.getAllMapPins);

// Get map pin by ID
router.get("/:id", userMapPinController.getMapPinById);

// Get all map pins for a specific user
router.get("/user/:userId", userMapPinController.getUserMapPins);

// Create a new map pin
router.post("/", userMapPinController.createMapPin);

// Update a map pin
router.put("/:id", userMapPinController.updateMapPin);

// Delete a map pin
router.delete("/:userId/:pinId", userMapPinController.deleteMapPin);

// Delete all map pins for a specific user
router.delete("/user/:userId", userMapPinController.deleteUserMapPins);

module.exports = router;