// controllers/cartController.js
const Cart = require("../model/Cart");
const Product = require("../model/product_model")


const addToCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user;

    try {
      let cart = await Cart.findOne({ userId });
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      if (cart) {
        const productIndex = cart.products.findIndex(
          (p) => p.productId.toString() === productId
        );
  
        if (productIndex > -1) {
          // Get the current quantity of the product in the cart
          const currentQuantity = cart.products[productIndex].quantity;
  
          // Check if adding one more would exceed stock
          if (currentQuantity + 1 > product.inventory) {
            return res.status(400).json({ message: 'Insufficient stock available' });
          }
  
          // Update the quantity in the cart
          cart.products[productIndex].quantity += 1;
        } else {
          // Check if there is enough stock to add the new product
          if (1 > product.inventory) {
            return res.status(400).json({ message: 'Insufficient stock available' });
          }
  
          // Add new product to the cart
          cart.products.push({ productId, quantity: 1 });
        }
      } else {
        // Check if there is enough stock to create a new cart with the new product
        if (1 > product.stock) {
          return res.status(400).json({ message: 'Insufficient stock available' });
        }
  
        // Create a new cart for the user
        cart = new Cart({
          userId,
          products: [{ productId, quantity: 1 }],
        });
      }
  
      await cart.save();
      res.status(200).json({ message: "Product added to cart", cart });
    } catch (error) {
      res.status(500).json({ message: "Error adding to cart", error });
    }
  };

  
  const updateCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user;
  
    try {
      const cart = await Cart.findOne({ userId });
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      if (cart) {
        const productIndex = cart.products.findIndex(
          (p) => p.productId.toString() === productId
        );
  
        if (productIndex > -1) {
          if (quantity > product.inventory) {
            return res.status(400).json({ message: 'Insufficient stock available' });
          }
          cart.products[productIndex].quantity = quantity;
          await cart.save();
          res.status(200).json({ message: "Cart updated", cart });
        } else {
          res.status(404).json({ message: "Product not found in cart" });
        }
      } else {
        res.status(404).json({ message: "Cart not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating cart", error });
    }
  };
  

  const incrementItem = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user;
  
    try {
      const cart = await Cart.findOne({ userId });
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
  
      if (productIndex > -1) {
        if (cart.products[productIndex].quantity + 1 > product.inventory) {
          return res.status(400).json({ message: 'Insufficient stock available' });
        }
        cart.products[productIndex].quantity += 1;
        await cart.save();
        res.status(200).json({ message: 'Item incremented', cart });
      } else {
        res.status(404).json({ message: 'Product not found in cart' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error incrementing item', error });
    }
  };
  
  
  const decrementItem = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user;
  
    try {
      const cart = await Cart.findOne({ userId });
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
  
      if (productIndex > -1) {
        if (cart.products[productIndex].quantity > 1) {
          cart.products[productIndex].quantity -= 1;
          await cart.save();
          res.status(200).json({ message: 'Item decremented', cart });
        } else {
          res.status(400).json({ message: 'Quantity cannot be less than 1' });
        }
      } else {
        res.status(404).json({ message: 'Product not found in cart' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error decrementing item', error });
    }
  };
  


  const removeFromCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user;
  
    console.log("Product ID to remove:", productId);
    console.log("User ID:", userId);
  
    try {
      const cart = await Cart.findOne({ userId });
  
      if (cart) {
        const initialProductCount = cart.products.length;
        cart.products = cart.products.filter(
          (p) => p.productId.toString() !== productId.toString()
        );
        const finalProductCount = cart.products.length;
  
        console.log("Initial product count:", initialProductCount);
        console.log("Final product count:", finalProductCount);
  
        // Check if the product was actually removed
        if (initialProductCount === finalProductCount) {
          return res.status(404).json({ message: "Product not found in cart" });
        }
  
        await cart.save();
        res.status(200).json({ message: "Product removed from cart", cart });
      } else {
        res.status(404).json({ message: "Cart not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error removing from cart", error });
    }
  };
  

const getCart = async (req, res) => {
    const userId = req.user;
  
    try {
      const cart = await Cart.findOne({ userId }).populate('products.productId');
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
      res.json({ cart });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cart', error });
    }
  };
  

module.exports = { addToCart, updateCart, removeFromCart ,decrementItem,incrementItem ,getCart};
