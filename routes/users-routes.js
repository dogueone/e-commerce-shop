const express = require("express");
const { body } = require("express-validator");

const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", usersControllers.getUsers);

router.post(
  "/signup",
  [
    body("email").normalizeEmail().isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);

router.post("/login", usersControllers.login);

router.post("/payment", usersControllers.createPaymentIntent);

module.exports = router;
