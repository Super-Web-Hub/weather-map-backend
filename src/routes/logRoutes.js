const express = require("express");
const logController = require("../controllers/logController");

const router = express.Router();

// Route to add a log
router.post("/log", logController.addLog);

// Route to get all logs
router.get("/logs", logController.getAllLogs);

// Route to get a specific log by ID
router.get("/logs/:id", logController.getLogById);



module.exports = router;