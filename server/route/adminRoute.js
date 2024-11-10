const express = require("express");
const router = express.Router();
// const multer = require('multer')
const upload = require("../Middleware/upload"); // Adjust the path as necessary

const {
  AdminLogin,
  DeliveryLogin,
  ExpertLogin,
  getAllCounts,
  sendNotification,
  getAllNotifications,
  deleteNotification,
} = require("../controller/LoginController");
const authMiddleware = require("../middleware/auth_middleware");

router.post("/admin-login", AdminLogin);
router.post("/sendNotification", authMiddleware, sendNotification);
router.get("/getAllNotifications", authMiddleware, getAllNotifications);
router.delete("/deleteNotification/:id", authMiddleware, deleteNotification);
router.post("/delivery-login", DeliveryLogin);
router.post("/expert-login", ExpertLogin);
router.get("/getAllCounts", authMiddleware, getAllCounts);

module.exports = router;
