const express = require('express');
const router = express.Router();
const TypingSession = require('../models/typingSession.model');
const auth = require('../middleware/auth.middleware');

// Create new typing session
router.post('/', auth, async (req, res) => {
  try {
    const session = new TypingSession({
      ...req.body,
      userId: req.user._id
    });
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get('/:userId', auth, async (req, res) => {
  try {
    const sessions = await TypingSession.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(sessions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get('/stats/:userId', auth, async (req, res) => {
  try {
    const stats = await TypingSession.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          avgWpm: { $avg: '$wpm' },
          avgAccuracy: { $avg: '$accuracy' },
          totalSessions: { $sum: 1 },
          bestWpm: { $max: '$wpm' },
          bestAccuracy: { $max: '$accuracy' }
        }
      }
    ]);
    res.json(stats[0] || {});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 