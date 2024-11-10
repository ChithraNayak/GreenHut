// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const { addToCart,getCart, updateCart, removeFromCart,incrementItem,decrementItem } = require('../controller/cartController');
const auth = require("../middleware/auth_middleware");

router.post('/add',auth, addToCart);
router.put('/update', updateCart);
router.put('/increment', auth, incrementItem);
router.put('/decrement', auth, decrementItem);
router.delete('/remove', auth,removeFromCart);
router.get('/cart', auth, getCart);

module.exports = router;
