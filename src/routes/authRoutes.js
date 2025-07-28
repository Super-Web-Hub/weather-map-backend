const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/login", authController.loginUser);
router.post("/register", authController.registerUser);
router.post("/forgot-password", authController.forgotPassword);
router.post("/me", authController.getUser);
router.put("/update",  authController.updateUser);

module.exports = router;
