// eslint-disable-next-line no-undef
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  image: {
    type: String,
  },

  status: { type: Boolean, default: true },
});

const categoryCollection = mongoose.model("category", categorySchema);
// eslint-disable-next-line no-undef
module.exports = categoryCollection;
