const mongoose = require('mongoose');

const researchProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interests: [{
    type: String,
    trim: true
  }],
  expertise: [{
    type: String,
    trim: true
  }],
  publications: [{
    title: String,
    authors: [String],
    journal: String,
    year: Number,
    doi: String
  }],
  keywords: [{
    type: String,
    trim: true
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ResearchProfile', researchProfileSchema);
