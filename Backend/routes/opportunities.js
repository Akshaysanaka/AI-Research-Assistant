const express = require('express');
const auth = require('../middleware/auth');
const Grant = require('../models/Grant');

const router = express.Router();

// Get grant opportunities
router.get('/', auth, async (req, res) => {
  try {
    const grants = await Grant.find()
      .sort({ deadline: 1 });

    res.json(grants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add grant opportunity (admin function, placeholder)
router.post('/', auth, async (req, res) => {
  try {
    const { title, fundingBody, deadline, eligibility, description, amount, url, keywords } = req.body;

    const grant = new Grant({
      title,
      fundingBody,
      deadline,
      eligibility,
      description,
      amount,
      url,
      keywords: keywords || []
    });

    await grant.save();
    res.status(201).json({ message: 'Grant added successfully', grant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
