// eslint-disable-next-line no-undef
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  number: Number,
  status: { type: Boolean, default: true },

  address: [
    {
      name: String,
      addressline1: String,
      addressline2: String,
      district: String,
      state: String,
      country: String,
      pin: Number,
      mobile: Number,
      status: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const userCollection = mongoose.model("user", userSchema);
// eslint-disable-next-line no-undef
module.exports = userCollection;
