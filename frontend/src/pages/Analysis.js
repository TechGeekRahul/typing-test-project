import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Analysis = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [errorAnalysis, setErrorAnalysis] = useState(null);
  const [patternAnalysis, setPatternAnalysis] = useState(null);
  const [insights, setInsights] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      fetchAnalysis();
    }
  }, [selectedSession]);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`/api/sessions/${user._id}`);
      setSessions(response.data);
      if (response.data.length > 0) {
        setSelectedSession(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysis = async () => {
    try {
      const [errorResponse, patternResponse, insightResponse] = await Promise.all([
        axios.get(`/api/analysis/errors/${selectedSession}`),
        axios.get(`/api/analysis/patterns/${selectedSession}`),
        axios.get(`/api/analysis/insights/${selectedSession}`)
      ]);

      setErrorAnalysis(errorResponse.data);
      setPatternAnalysis(patternResponse.data);
      setInsights(insightResponse.data);
    } catch (error) {
      console.error('Error fetching analysis:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Typing Analysis
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Performance Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sessions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="createdAt" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="wpm" stroke="#8884d8" name="WPM" />
                  <Line type="monotone" dataKey="accuracy" stroke="#82ca9d" name="Accuracy" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Error Analysis" />
                <Tab label="Pattern Analysis" />
                <Tab label="Psychological Insights" />
              </Tabs>

              {tabValue === 0 && errorAnalysis && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Error Analysis
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Most Error-Prone Words
                        </Typography>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={errorAnalysis.mostErrorWords}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="word" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Error Statistics
                        </Typography>
                        <Typography>Total Errors: {errorAnalysis.totalErrors}</Typography>
                        <Typography>Error Rate: {errorAnalysis.errorRate.toFixed(2)}%</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {tabValue === 1 && patternAnalysis && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Typing Patterns
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Slowest Words
                        </Typography>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={patternAnalysis.slowestWords}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="word" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="duration" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Pattern Statistics
                        </Typography>
                        <Typography>
                          Average Word Duration: {patternAnalysis.averageWordDuration.toFixed(2)}s
                        </Typography>
                        <Typography>
                          Speed Variation: {patternAnalysis.speedVariation.toFixed(2)}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {tabValue === 2 && insights && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Psychological Insights
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Impulsivity vs. Deliberation
                        </Typography>
                        <Typography>
                          Score: {insights.impulsivity.score.toFixed(1)}
                        </Typography>
                        <Typography>
                          {insights.impulsivity.interpretation}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Cognitive Load
                        </Typography>
                        <Typography>
                          Score: {insights.cognitiveLoad.score.toFixed(1)}
                        </Typography>
                        <Typography>
                          {insights.cognitiveLoad.interpretation}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Resilience
                        </Typography>
                        <Typography>
                          Score: {insights.resilience.score.toFixed(1)}
                        </Typography>
                        <Typography>
                          {insights.resilience.interpretation}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Pressure Response
                        </Typography>
                        <Typography>
                          Score: {insights.pressureResponse.score.toFixed(1)}
                        </Typography>
                        <Typography>
                          {insights.pressureResponse.interpretation}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Analysis; 