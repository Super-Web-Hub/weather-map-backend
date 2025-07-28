const express = require("express");
const dataController = require("../controllers/dataController");

const router = express.Router();

router.get("/weather", dataController.getLiveWeatherData);
router.get("/earthquake", dataController.getEarthQuakeData);
router.get("/maritime", dataController.getMaritimeTrafficData);
router.get("/air-traffic", dataController.getAirTrafficData);

module.exports = router;
