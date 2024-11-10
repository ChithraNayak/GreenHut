const express = require("express");
const router = express.Router();
const expertController = require("../controller/expert_controller");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/auth_middleware");

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Routes for experts
router.get("/", expertController.getExperts);
router.get(
  "/getAppointmentsCount",
  authMiddleware,
  expertController.getAppointmentsCount
);
router.get(
  "/viewAllBookings",
  authMiddleware,
  expertController.viewAllBookings
);
router.put("/updateStatus/:id", authMiddleware, expertController.updateStatus);
router.get("/:id", expertController.getExpertById);
router.post("/", upload.single("image"), expertController.createExpert);
router.put("/:id", upload.single("image"), expertController.updateExpert);
router.delete("/:id", expertController.deleteExpert);

module.exports = router;
