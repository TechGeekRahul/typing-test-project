const express = require('express');
const router = express.Router();
const TypingSession = require('../models/typingSession.model');
const auth = require('../middleware/auth.middleware');


router.get('/errors/:sessionId', auth, async (req, res) => {
  try {
    const session = await TypingSession.findOne({
      _id: req.params.sessionId,
      userId: req.user._id
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

  
    const errorAnalysis = {
      mostErrorWords: session.errorWords
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      totalErrors: session.totalErrors,
      errorRate: (session.totalErrors / session.typingDurations.length) * 100
    };

    res.json(errorAnalysis);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get('/patterns/:sessionId', auth, async (req, res) => {
  try {
    const session = await TypingSession.findOne({
      _id: req.params.sessionId,
      userId: req.user._id
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }


    const patternAnalysis = {
      slowestWords: session.typingDurations
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5),
      averageWordDuration: session.typingDurations.reduce((acc, curr) => acc + curr.duration, 0) / session.typingDurations.length,
      speedVariation: calculateSpeedVariation(session.typingDurations)
    };

    res.json(patternAnalysis);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get('/insights/:sessionId', auth, async (req, res) => {
  try {
    const session = await TypingSession.findOne({
      _id: req.params.sessionId,
      userId: req.user._id
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

   
    const insights = {
      impulsivity: calculateImpulsivity(session),
      cognitiveLoad: calculateCognitiveLoad(session),
      resilience: calculateResilience(session),
      pressureResponse: calculatePressureResponse(session)
    };

    res.json(insights);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


function calculateSpeedVariation(typingDurations) {
  const speeds = typingDurations.map(d => 1 / d.duration);
  const mean = speeds.reduce((a, b) => a + b, 0) / speeds.length;
  const variance = speeds.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / speeds.length;
  return Math.sqrt(variance);
}

function calculateImpulsivity(session) {
  const errorRate = session.totalErrors / session.typingDurations.length;
  const avgSpeed = session.wpm;
  return {
    score: (errorRate * 0.7 + (avgSpeed / 100) * 0.3) * 100,
    interpretation: errorRate > 0.1 ? 'High impulsivity' : 'Low impulsivity'
  };
}

function calculateCognitiveLoad(session) {
  const avgWordLength = session.typingDurations.reduce((acc, curr) => acc + curr.word.length, 0) / session.typingDurations.length;
  const errorRate = session.totalErrors / session.typingDurations.length;
  return {
    score: (avgWordLength * 0.6 + errorRate * 0.4) * 100,
    interpretation: avgWordLength > 8 ? 'High cognitive load' : 'Low cognitive load'
  };
}

function calculateResilience(session) {
  const errorRecovery = session.typingDurations
    .filter((d, i) => i > 0 && d.duration < session.typingDurations[i - 1].duration)
    .length / session.typingDurations.length;
  return {
    score: errorRecovery * 100,
    interpretation: errorRecovery > 0.7 ? 'High resilience' : 'Low resilience'
  };
}

function calculatePressureResponse(session) {
  const timeRatio = session.duration / 30; // Normalize to 30 seconds
  const performanceRatio = session.wpm / 60; // Normalize to 60 WPM
  return {
    score: (performanceRatio / timeRatio) * 100,
    interpretation: performanceRatio > timeRatio ? 'Good under pressure' : 'Struggles under pressure'
  };
}

module.exports = router; 