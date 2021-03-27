const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Product", productSchema);
