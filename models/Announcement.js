const mongoose = require("mongoose");

const AnnouncementSchema = mongoose.Schema({
  content: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Announcement", AnnouncementSchema);
