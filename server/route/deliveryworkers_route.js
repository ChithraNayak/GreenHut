// server/deliveryworkers_route.js

const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getAllWorkers,
  addWorker,
  updateWorker,
  deleteWorker,
  getAllCounts,
} = require("../controller/deliveryworkers_controller");
const authMiddleware = require("../middleware/auth_middleware");

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// CRUD Routes
router.get("/", getAllWorkers);
router.get("/getAllCounts", authMiddleware, getAllCounts);
router.post("/", upload.single("image"), addWorker);
router.put("/:id", upload.single("image"), updateWorker);
router.delete("/:id", deleteWorker);

module.exports = router;
