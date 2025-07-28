const express = require("express");
const userController = require("../controllers/userController");
const checkRole = require("../middleware/checkRole");
const upload = require("../config/multer");

const router = express.Router(); // Use express.Router()

router.get("/:id", userController.getUser);
router.get("/", userController.getUsers);
router.post("/", upload.single("avatar"), userController.createUser);
router.post("/login", userController.loginUser);

router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.post(
  "/upload/avatar",
  upload.single("avatar"),
  userController.uploadAvatar
);


module.exports = router;
