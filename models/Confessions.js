const mongoose = require("mongoose");

const ConfessionSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  confession: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Confession", ConfessionSchema);
