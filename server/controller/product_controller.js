const Product = require("../model/product_model");

// Get all products with an optional category filter
const getProducts = async (req, res) => {
  try {
    const { category } = req.query; // Get category from query parameters
    let filter = {};

    // Add category filter if provided
    if (category && category !== "all") {
      filter.category = category;
    }

    const products = await Product.find(filter).populate("ratings.userId"); // Fetch products based on the filter
    const productsWithImageUrls = products.map((product) => ({
      ...product.toObject(),
      image: product.image
        ? `${req.protocol}://${req.get("host")}/uploads/${product.image}`
        : null,
    }));

    res.json(productsWithImageUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, inventory } = req.body; // Added inventory
    const image = req.file ? req.file.filename : null;
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image,
      inventory, // Added inventory
    });
    await newProduct.save();
    res.status(201).json({
      ...newProduct.toObject(),
      image: image
        ? `${req.protocol}://${req.get("host")}/uploads/${image}`
        : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, inventory } = req.body; // Added inventory
    const image = req.file ? req.file.filename : null;

    // Find the existing product to get the current image if no new image is uploaded
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product data
    const updatedData = {
      name,
      description,
      price,
      category,
      inventory, // Added inventory
    };

    // Only update the image if a new image is uploaded
    if (image) {
      updatedData.image = image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.json({
      ...updatedProduct.toObject(),
      image: updatedData.image
        ? `${req.protocol}://${req.get("host")}/uploads/${updatedData.image}`
        : `${req.protocol}://${req.get("host")}/uploads/${
            existingProduct.image
          }`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const giveRating = async (req, res) => {
  try {
    const { id } = req.params;
    var product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    } else {
      const userId = req.user;
      console.log(userId);
      const { rating, feedback } = req.body;
      const newRating = { userId, rating, feedback };
      const finalFeedback = [...product.ratings, newRating];
      const updateProduct = {};
      updateProduct.ratings = finalFeedback;
      product = await Product.findByIdAndUpdate(
        id,
        { $set: updateProduct },
        { new: true }
      );
      res.json({
        success: true,
        message: "Thank your for your valuable feedback!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  giveRating,
};
