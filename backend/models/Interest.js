const mongoose = require('mongoose');

const InterestSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  youtubeLinks: [String], topics: [String],
  articlesRead: [{ title: String, url: String, dateAdded: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Interest', InterestSchema);
