const express = require("express");
const { createOrder, fetchOrderByUser, fetchAllOrders } = require("../controller/Order");


const router = express.Router();

router.post('/', createOrder).get('/all-orders', fetchAllOrders).get('/', fetchOrderByUser);

exports.router = router;