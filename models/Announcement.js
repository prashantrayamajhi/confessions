const mongoose = require("mongoose");

const AnnouncementSchema = mongoose.Schema({
  title: {
    type: String,
  },
  Content: {
    type: String,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Announcement", AnnouncementSchema);
