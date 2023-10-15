const express = require('express');
const { addToCart, fetchCartByUser, deleteFromCart, updateCart } = require('../controller/Cart');

const router = express.Router();

router.post('/', addToCart).get('/', fetchCartByUser).delete('/:productId', deleteFromCart).put('/:id', updateCart);

exports.router = router;