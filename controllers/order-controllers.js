const HttpError = require("../models/http-error");
const Product = require("../models/product");
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);

const getOrder = async (req, res, next) => {
  const orderData = req.body;
  let confirmedOrder = [];
  let totalPrice = 0;
  let bookId;
  try {
    if (orderData.length < 1) {
      //optional just in case
      throw Error;
    }
    for (item of orderData) {
      bookId = item.id;
      const book = await Product.findById(item.id);
      totalPrice += book.price * item.quantity;
      if (totalPrice <= 0) {
        //optional just in case
        throw Error;
      }
      confirmedOrder.push({ content: book, quantity: item.quantity });
    }
  } catch (err) {
    return next(new HttpError("Could not find a book " + bookId, 404));
  }
  res.json({ confirmedOrder, totalPrice });
};

const createPaymentIntent = async (req, res, next) => {
  const orderData = req.body; // [{id:31dse1sqr1ewdas, quantity: 2},{id:31dse1sqrsdad54, quantity: 1},..]
  let confirmedOrder = [];
  let totalPrice = 0;
  let bookId;

  for (item of orderData) {
    bookId = item.id;
    let book;
    try {
      book = await Product.findById(item.id);
    } catch (err) {
      return next(
        new HttpError("Fetching book failed, please try again later", 500)
      );
    }
    if (!book) {
      return next(
        new HttpError(
          "Could not find a book for the provided id " + bookId,
          404
        )
      );
    }
    if (item.quantity <= 0 || !Number.isInteger(item.quantity)) {
      return next(new HttpError("Wrong quantity " + bookId, 400));
    }
    totalPrice += book.price * item.quantity;
    confirmedOrder.push({ content: book, quantity: item.quantity });
  }

  // res.json([confirmedOrder, { totalPrice }]);

  // let paymentIntent;
  // const calculateOrderAmount = (items) => {
  //   // Replace this constant with a calculation of the order's amount
  //   // Calculate the order total on the server to prevent
  //   // people from directly manipulating the amount on the client
  //   return 1400;
  // };
  try {
    paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: "usd",
      // description: "Tester",
      // payment_method: id,
      // confirm: true,
    });
    res.json({
      clientSecret: paymentIntent.client_secret,
      message: "Payment successful",
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.json({ message: "Payment failed", success: false });
  }
};

exports.getOrder = getOrder;
exports.createPaymentIntent = createPaymentIntent;
