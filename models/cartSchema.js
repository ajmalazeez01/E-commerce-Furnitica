// eslint-disable-next-line no-undef
const mongoose = require("mongoose");

let cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "users",
  },
  cartItem: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        ref: "poducts",
      },
      qty: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});
let cartCollection = mongoose.model("cart", cartSchema);

// eslint-disable-next-line no-undef
module.exports = cartCollection;
