import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  Psychology as PsychologyIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <SpeedIcon />,
      title: 'Speed Testing',
      description: 'Measure your typing speed in words per minute (WPM) with customizable test durations.',
    },
    {
      icon: <CheckCircleIcon />,
      title: 'Accuracy Tracking',
      description: 'Track your typing accuracy and identify areas for improvement.',
    },
    {
      icon: <PsychologyIcon />,
      title: 'Psychological Insights',
      description: 'Get insights into your typing behavior and cognitive patterns.',
    },
    {
      icon: <TimelineIcon />,
      title: 'Performance Analytics',
      description: 'View detailed analytics and track your progress over time.',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box textAlign="center" mb={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Welcome to Typing Test
              </Typography>
              <Typography variant="h5" color="text.secondary" paragraph>
                Improve your typing speed and accuracy with our advanced typing test platform
              </Typography>
              {!isAuthenticated && (
                <Box sx={{ mt: 4 }}>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    size="large"
                    sx={{ mr: 2 }}
                  >
                    Get Started
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    size="large"
                  >
                    Sign In
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h4" component="h2" gutterBottom textAlign="center">
              Features
            </Typography>
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          {feature.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={feature.title}
                          secondary={feature.description}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Box textAlign="center" mt={6}>
              <Typography variant="h4" component="h2" gutterBottom>
                Ready to Start?
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Take a typing test and discover insights about your typing behavior
              </Typography>
              {isAuthenticated ? (
                <Button
                  component={RouterLink}
                  to="/test"
                  variant="contained"
                  size="large"
                >
                  Take Test
                </Button>
              ) : (
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  size="large"
                >
                  Create Account
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home; 