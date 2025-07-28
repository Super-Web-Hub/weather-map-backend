const express = require("express");
const router = express.Router();
const settingController = require("../controllers/settingController");
const upload = require("../config/multer_icon");

// Create a new setting
router.post("/", settingController.createSetting);

router.get("/", settingController.getSettings); // Get the single settings row
router.put("/", settingController.updateSettings); // Update the single settings row
router.post(
  "/upload/icon",
  upload.single("site_icon"),
  settingController.uploadSiteIcon
); // Upload site icon

module.exports = router;
