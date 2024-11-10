const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/category_controller");

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/categories", getCategories);
router.post("/categories", upload.single("image"), createCategory);
router.put("/categories/:id", upload.single("image"), updateCategory);
router.delete("/categories/:id", deleteCategory);

module.exports = router;
