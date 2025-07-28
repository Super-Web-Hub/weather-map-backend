const express = require("express");
const adminController = require("../controllers/adminController");
const upload = require("../config/multer");

const router = express.Router(); // Use express.Router()

router.get("/:id", adminController.getAdmin);
router.get("/", adminController.getAdmins);
router.post("/", upload.single("avatar"), adminController.createAdmin);
router.put("/:id", adminController.updateAdmin);
router.delete("/:id", adminController.deleteAdmin);
router.post(
  "/upload/avatar",
  upload.single("avatar"),
  adminController.uploadAvatar
);


module.exports = router;
