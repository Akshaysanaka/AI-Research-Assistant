const mongoose = require('mongoose');

const grantSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  fundingBody: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  eligibility: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: String
  },
  url: {
    type: String
  },
  keywords: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Grant', grantSchema);
