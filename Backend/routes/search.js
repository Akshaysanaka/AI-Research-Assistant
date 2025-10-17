const express = require('express');
const auth = require('../middleware/auth');
const ResearchProfile = require('../models/ResearchProfile');
const User = require('../models/User');

const router = express.Router();

// Semantic search for collaborators
router.post('/', auth, async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Simple keyword-based search (placeholder for LangChain integration)
    const keywords = query.toLowerCase().split(' ');

    const profiles = await ResearchProfile.find({
      $or: [
        { interests: { $in: keywords } },
        { expertise: { $in: keywords } },
        { keywords: { $in: keywords } }
      ],
      user: { $ne: req.user._id } // Exclude self
    }).populate('user', 'email profile').limit(10);

    res.json({ results: profiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
