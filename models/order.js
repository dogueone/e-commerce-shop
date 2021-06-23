const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  order: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Order", orderSchema);
