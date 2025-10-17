const express = require('express');
const auth = require('../middleware/auth');
const Collaboration = require('../models/Collaboration');

const router = express.Router();

// Get suggested collaborators
router.get('/', auth, async (req, res) => {
  try {
    const collaborations = await Collaboration.find({ user: req.user._id })
      .populate('suggestedUser', 'email profile')
      .sort({ matchScore: -1 });

    res.json(collaborations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
