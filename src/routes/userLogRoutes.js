const express = require("express");
const router = express.Router();
const userLogController = require("../controllers/logController");

// Create a new log
router.post("/", userLogController.addLog);

// Get all logs
router.get("/", userLogController.getAllLogs);

module.exports = router;
