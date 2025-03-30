const mongoose = require('mongoose');

const typingSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wpm: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalErrors: {
    type: Number,
    required: true,
    min: 0
  },
  errorWords: [{
    word: String,
    count: Number
  }],
  typingDurations: [{
    word: String,
    duration: Number
  }],
  textType: {
    type: String,
    enum: ['words', 'numbers', 'mixed'],
    required: true
  },
  duration: {
    type: Number,
    enum: [15, 30],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


typingSessionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('TypingSession', typingSessionSchema); 