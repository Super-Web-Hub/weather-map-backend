const express = require("express");
const router = express.Router();

const userRouter = require("./userRoutes");
const authRouter = require("./authRoutes");
const adminRouter = require("./adminRoutes");
const planRouter = require("./planRoutes");
const settingRouter = require("./settingRoutes");
const contactRouter = require("./contactRoutes");
const privacyController = require("./privacyRoutes");
const faqRouter = require("./faqRoutes"); // Add FAQ route
const userLogRouter = require("./userLogRoutes"); // Add user log route
const dailyEventsRouter = require("./dailyEventsRoutes");
const dataRouter = require("./dataRoutes"); // Add data route
const userMapPinsRouter = require("./userMapPinsRoutes");
const cityRouter = require("./cityRoutes");

// const apiSourceRouter = require("./apisource");

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/admins", adminRouter);
router.use("/plans", planRouter);
router.use("/settings", settingRouter);
router.use("/contact", contactRouter);
router.use("/privacy", privacyController);
router.use("/daily-events", dailyEventsRouter);
// router.use("/source", apiSourceRouter);
router.use("/faq", faqRouter); // Use FAQ route
router.use("/userLogs", require("./userLogRoutes")); // Use user log route
router.use("/data", dataRouter); // Use data route
router.use("/map-pins", userMapPinsRouter); // Use user map pins route
router.use("/cities", cityRouter);

module.exports = router;
