import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const sampleTexts = {
  words: "The quick brown fox jumps over the lazy dog. This simple pangram contains every letter of the English alphabet at least once. Typing practice helps improve your speed and accuracy.",
  numbers: "123 456 789 0 12 34 56 78 90 123 456 789 0 12 34 56 78 90 123 456 789 0",
  mixed: "User123 entered the password! @#$%^&*() and then clicked the Submit button. The system processed request #456 in 0.5 seconds."
};

const TypingTest = () => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [results, setResults] = useState(null);
  const [textType, setTextType] = useState('words');
  const [duration, setDuration] = useState(30);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [wordTimings, setWordTimings] = useState([]);
  const [errorWords, setErrorWords] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    setText(sampleTexts[textType]);
    setInput('');
    setResults(null);
    setErrors(0);
    setWordTimings([]);
    setErrorWords([]);
  }, [textType]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endTest();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTest = () => {
    setTimeLeft(duration);
    setIsActive(true);
    setStartTime(Date.now());
    inputRef.current?.focus();
  };

  const endTest = () => {
    setIsActive(false);
    calculateResults();
  };

  const calculateResults = () => {
    const words = text.split(' ');
    const inputWords = input.split(' ');
    const totalWords = words.length;
    const correctWords = words.filter((word, index) => word === inputWords[index]).length;
    const wpm = Math.round((correctWords / (duration / 60)) * 100) / 100;
    const accuracy = Math.round((correctWords / totalWords) * 100);

    const sessionData = {
      userId: user._id,
      wpm,
      accuracy,
      totalErrors: errors,
      errorWords,
      typingDurations: wordTimings,
      textType,
      duration,
    };

    saveSession(sessionData);
    setResults({ wpm, accuracy, errors });
  };

  const saveSession = async (sessionData) => {
    try {
      await axios.post('/api/sessions', sessionData);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const handleInputChange = (e) => {
    if (!isActive) return;
    
    const newInput = e.target.value;
    setInput(newInput);

    // Calculate word timings
    const currentWord = newInput.split(' ').pop();
    const currentTime = Date.now();
    const wordStartTime = wordTimings.length === 0 ? startTime : wordTimings[wordTimings.length - 1].endTime;
    const wordDuration = (currentTime - wordStartTime) / 1000; // in seconds

    // Check for errors
    const currentWordIndex = newInput.split(' ').length - 1;
    const expectedWord = text.split(' ')[currentWordIndex];
    
    if (currentWord !== expectedWord) {
      setErrors(prev => prev + 1);
      setErrorWords(prev => {
        const existingError = prev.find(e => e.word === expectedWord);
        if (existingError) {
          return prev.map(e => 
            e.word === expectedWord ? { ...e, count: e.count + 1 } : e
          );
        }
        return [...prev, { word: expectedWord, count: 1 }];
      });
    }

    // Update word timings
    if (newInput.endsWith(' ')) {
      setWordTimings(prev => [
        ...prev,
        {
          word: currentWord,
          duration: wordDuration,
          endTime: currentTime
        }
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isActive) {
      startTest();
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Text Type</InputLabel>
              <Select
                value={textType}
                label="Text Type"
                onChange={(e) => setTextType(e.target.value)}
                disabled={isActive}
              >
                <MenuItem value="words">Words Only</MenuItem>
                <MenuItem value="numbers">Numbers Only</MenuItem>
                <MenuItem value="mixed">Mixed Content</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Duration</InputLabel>
              <Select
                value={duration}
                label="Duration"
                onChange={(e) => setDuration(e.target.value)}
                disabled={isActive}
              >
                <MenuItem value={15}>15 seconds</MenuItem>
                <MenuItem value={30}>30 seconds</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 2, bgcolor: 'background.default' }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {text.split(' ').map((word, index) => {
                  const inputWord = input.split(' ')[index];
                  const isCorrect = word === inputWord;
                  const isCurrent = index === input.split(' ').length;
                  
                  return (
                    <span
                      key={index}
                      style={{
                        color: isCurrent ? 'primary.main' : 
                               !isCorrect && inputWord ? 'error.main' : 
                               'text.primary',
                        backgroundColor: isCurrent ? 'rgba(144, 202, 249, 0.2)' : 'transparent',
                        padding: '0 2px',
                        borderRadius: '2px',
                      }}
                    >
                      {word}{' '}
                    </span>
                  );
                })}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={!isActive && timeLeft === duration}
              inputRef={inputRef}
              placeholder={isActive ? "Start typing..." : "Press Enter to start"}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Time Left: {timeLeft}s
              </Typography>
              {!isActive && timeLeft === duration && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={startTest}
                >
                  Start Test
                </Button>
              )}
            </Box>
          </Grid>
          {results && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Results
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body1">
                      WPM: {results.wpm}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body1">
                      Accuracy: {results.accuracy}%
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body1">
                      Errors: {results.errors}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default TypingTest; 