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
  level: {
    type: "String",
    default: "user",
    enum: ["user", "admin"],
  },
});

module.exports = mongoose.model("Confession", ConfessionSchema);
