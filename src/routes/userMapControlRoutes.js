const express = require("express");
const mapControlsController = require("../controllers/mapControlsController");

const router = express.Router();

// Get all map controls
router.get("/", mapControlsController.getAllMapControls);

// Get map controls for a specific user
router.get("/user/:userId", mapControlsController.getUserMapControls);


// Update map controls for a specific user
router.put("/user/:userId", mapControlsController.updateUserMapControls);


module.exports = router;