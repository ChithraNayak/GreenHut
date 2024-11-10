const express = require("express");
const router = express.Router();
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  giveRating,
} = require("../controller/product_controller");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/auth_middleware");

// Get all products
router.get("/", getProducts);

// Add a new product
router.post("/", upload.single("image"), addProduct);

// Update an existing product
router.put("/:id", upload.single("image"), updateProduct);

// Delete a product
router.delete("/:id", deleteProduct);
router.put("/giveRating/:id", authMiddleware, giveRating);

module.exports = router;
