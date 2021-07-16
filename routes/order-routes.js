const express = require("express");

const orderControllers = require("../controllers/order-controllers");

const router = express.Router();

router.post("/cart/order", orderControllers.getOrder);

router.post("/payment", orderControllers.createPaymentIntent);

module.exports = router;
