const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  wishList: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        ref: "poduct",
      },
      qty: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});

let wishlistCollection = mongoose.model("wishlist", wishlistSchema);

module.exports = wishlistCollection;
