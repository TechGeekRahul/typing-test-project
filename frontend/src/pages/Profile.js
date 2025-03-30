import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Avatar,
  Divider,
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
} from 'recharts';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [statsResponse, sessionsResponse] = await Promise.all([
        axios.get(`/api/sessions/stats/${user._id}`),
        axios.get(`/api/sessions/${user._id}`)
      ]);

      setStats(statsResponse.data);
      setSessions(sessionsResponse.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: '0 auto 16px',
                  bgcolor: 'primary.main',
                }}
              >
                {user.username[0].toUpperCase()}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {user.username}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {user.email}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Overall Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {stats?.avgWpm?.toFixed(1) || 0}
                    </Typography>
                    <Typography color="text.secondary">
                      Average WPM
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {stats?.avgAccuracy?.toFixed(1) || 0}%
                    </Typography>
                    <Typography color="text.secondary">
                      Average Accuracy
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {stats?.totalSessions || 0}
                    </Typography>
                    <Typography color="text.secondary">
                      Total Sessions
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Performance History
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sessions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="createdAt"
                      tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(date) => new Date(date).toLocaleString()}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="wpm"
                      stroke="#8884d8"
                      name="WPM"
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#82ca9d"
                      name="Accuracy"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Best Performance
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Best WPM
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {stats?.bestWpm?.toFixed(1) || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Best Accuracy
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {stats?.bestAccuracy?.toFixed(1) || 0}%
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile; 