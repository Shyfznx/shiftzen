const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, default: 'My Portfolio' },
  description: String, heroImage: String,
  customURL:   { type: String, unique: true, sparse: true },
  isPublic:    { type: Boolean, default: true },
  viewCount:   { type: Number, default: 0 },
  theme: {
    primary:   { type: String, default: '#667eea' },
    secondary: { type: String, default: '#764ba2' },
    font:      { type: String, default: 'sans-serif' },
  },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
