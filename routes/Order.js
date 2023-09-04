const express = require("express");
const { createOrder, fetchOrderByUser, fetchAllOrders } = require("../controller/Order");


const router = express.Router();

router.post('/', createOrder).get('/', fetchAllOrders).get('/:user', fetchOrderByUser);

exports.router = router;