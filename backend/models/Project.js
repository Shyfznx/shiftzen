const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  description: String, images: [String], tags: [String],
  link: String, github: String, startDate: Date, endDate: Date,
  featured: { type: Boolean, default: false },
  type: { type: String, enum: ['project','internship','job','writing','art'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', ProjectSchema);
