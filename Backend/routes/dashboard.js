const express = require('express');
const auth = require('../middleware/auth');
const ResearchProfile = require('../models/ResearchProfile');
const Collaboration = require('../models/Collaboration');
const Grant = require('../models/Grant');

const router = express.Router();

// Get dashboard data
router.get('/', auth, async (req, res) => {
  try {
    const profile = await ResearchProfile.findOne({ user: req.user._id });
    const collaborations = await Collaboration.find({ user: req.user._id })
      .populate('suggestedUser', 'email profile')
      .limit(5);
    const grants = await Grant.find()
      .sort({ deadline: 1 })
      .limit(5);

    res.json({
      profile: profile || {},
      collaborations,
      grants
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
