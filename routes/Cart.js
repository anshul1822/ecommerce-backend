const express = require('express');
const { addToCart, fetchCartByUser, deleteFromCart, updateCart } = require('../controller/Cart');

const router = express.Router();

router.post('/', addToCart).get('/', fetchCartByUser).delete('/:id/:userId', deleteFromCart).put('/:id', updateCart);

exports.router = router;