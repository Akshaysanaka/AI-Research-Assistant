const express = require('express');
const auth = require('../middleware/auth');
const ResearchProfile = require('../models/ResearchProfile');

const router = express.Router();

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const profile = await ResearchProfile.findOne({ user: req.user._id });
    res.json(profile || {});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.post('/', auth, async (req, res) => {
  try {
    const { interests, expertise, publications, keywords } = req.body;

    let profile = await ResearchProfile.findOne({ user: req.user._id });

    if (profile) {
      profile.interests = interests || profile.interests;
      profile.expertise = expertise || profile.expertise;
      profile.publications = publications || profile.publications;
      profile.keywords = keywords || profile.keywords;
      profile.updatedAt = new Date();
      await profile.save();
    } else {
      profile = new ResearchProfile({
        user: req.user._id,
        interests: interests || [],
        expertise: expertise || [],
        publications: publications || [],
        keywords: keywords || []
      });
      await profile.save();
    }

    res.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
