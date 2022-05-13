const mongoose = require("mongoose");

const drugSchema = new mongoose.Schema({
  userId: { type: String },
  name: {
    type: String,
  },
  type: {
    type: String,
  },
  prDate: {
    type: String,
  },
  exDate: {
    type: String,
  },
  authnumber: {
    type: String,
  },
  status: {
    type: String,
  },
});

const Drug = mongoose.model("drug", drugSchema);

module.exports = Drug;
