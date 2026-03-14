import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  Container,
  Avatar,
  Stack,
  Badge,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Shield,
  Search,
  History,
  Warning,
  CheckCircle,
  Download,
  Share,
  Bell,
  Block,
  People,
  Lightbulb,
  Tag,
  Comment,
  Robot,
  Eraser,
  ChartBar,
  TrendingUp,
  Security,
  Assessment,
  Refresh,
  FilterList,
  Visibility,
  NotificationsActive,
  EmojiEvents,
  LocalFireDepartment,
  WaterDrop,
  Thunderstorm,
  Speed,
  Timeline,
  Analytics,
  GppGood,
  GppBad,
  PriorityHigh,
  Psychology,
  AutoGraph,
  Radar
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { analyzeMessage } from '../services/api';

const DashboardHome = () => {
  const [message, setMessage] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [totalScans, setTotalScans] = useState(0);
  const [flaggedCount, setFlaggedCount] = useState(0);
  const [safeCount, setSafeCount] = useState(0);
  const [animateStats, setAnimateStats] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load stats from localStorage or API
    const savedStats = localStorage.getItem('dashboardStats');
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      setTotalScans(stats.totalScans || 0);
      setFlaggedCount(stats.flaggedCount || 0);
      setSafeCount(stats.safeCount || 0);
    }
    // Trigger animation after component mounts
    setTimeout(() => setAnimateStats(true), 500);
  }, []);

  const handleAnalyze = async () => {
    if (!message.trim()) {
      setError('Please enter a message to analyze');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await analyzeMessage({ text: message });
      const result = response.data;
      
      setResults(result);
      
      // Update stats
      const newTotalScans = totalScans + 1;
      const newFlaggedCount = result.is_bullying ? flaggedCount + 1 : flaggedCount;
      const newSafeCount = !result.is_bullying ? safeCount + 1 : safeCount;
      
      setTotalScans(newTotalScans);
      setFlaggedCount(newFlaggedCount);
      setSafeCount(newSafeCount);
      
      // Save to localStorage
      localStorage.setItem('dashboardStats', JSON.stringify({
        totalScans: newTotalScans,
        flaggedCount: newFlaggedCount,
        safeCount: newSafeCount
      }));
      
    } catch (err) {
      setError('Failed to analyze message. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    setCharCount(e.target.value.length);
    setError('');
  };

  const clearResults = () => {
    setResults(null);
    setMessage('');
    setCharCount(0);
    setError('');
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return '#10b981';
    if (confidence >= 0.6) return '#f59e0b';
    return '#ef4444';
  };

  const getRiskLevel = (isBullying, confidence) => {
    if (!isBullying) return { level: 'Low Risk', color: '#10b981', icon: <GppGood /> };
    if (confidence >= 0.8) return { level: 'High Risk', color: '#ef4444', icon: <GppBad /> };
    return { level: 'Medium Risk', color: '#f59e0b', icon: <PriorityHigh /> };
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Cyberbullying Detection Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            AI-powered message analysis for safer online communities
          </Typography>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="white" variant="h4" fontWeight="bold">
                      {totalScans}
                    </Typography>
                    <Typography color="white" variant="body2">
                      Total Scans
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <Search sx={{ color: 'white', fontSize: 30 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="white" variant="h4" fontWeight="bold">
                      {flaggedCount}
                    </Typography>
                    <Typography color="white" variant="body2">
                      Flagged Messages
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <Warning sx={{ color: 'white', fontSize: 30 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="white" variant="h4" fontWeight="bold">
                      {safeCount}
                    </Typography>
                    <Typography color="white" variant="body2">
                      Safe Messages
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <CheckCircle sx={{ color: 'white', fontSize: 30 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="white" variant="h4" fontWeight="bold">
                      {totalScans > 0 ? Math.round((safeCount / totalScans) * 100) : 0}%
                    </Typography>
                    <Typography color="white" variant="body2">
                      Safety Rate
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <Shield sx={{ color: 'white', fontSize: 30 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Main Analysis Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Message Analyzer
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Enter a message to analyze for cyberbullying content..."
                    value={message}
                    onChange={handleMessageChange}
                    disabled={loading}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                    helperText={`Character count: ${charCount}/500`}
                    inputProps={{ maxLength: 500 }}
                  />
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleAnalyze}
                    disabled={loading || !message.trim()}
                    startIcon={loading ? <CircularProgress size={20} /> : <Search />}
                    sx={{ 
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                      }
                    }}
                  >
                    {loading ? 'Analyzing...' : 'Analyze Message'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={clearResults}
                    disabled={loading}
                    startIcon={<Refresh />}
                    sx={{ borderRadius: 2, px: 4, py: 1.5 }}
                  >
                    Clear
                  </Button>
                </Stack>

                {loading && (
                  <Box sx={{ mt: 3 }}>
                    <LinearProgress />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      AI model analyzing message content...
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Analysis Results
                </Typography>
                
                {results ? (
                  <Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Risk Assessment
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getRiskLevel(results.is_bullying, results.confidence).icon}
                        <Typography 
                          variant="h6" 
                          fontWeight="bold"
                          color={getRiskLevel(results.is_bullying, results.confidence).color}
                        >
                          {getRiskLevel(results.is_bullying, results.confidence).level}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Confidence Score
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={results.confidence * 100}
                          sx={{
                            flex: 1,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getConfidenceColor(results.confidence),
                            }
                          }}
                        />
                        <Typography variant="body2" fontWeight="bold">
                          {Math.round(results.confidence * 100)}%
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Classification
                      </Typography>
                      <Chip
                        label={results.is_bullying ? 'Bullying Detected' : 'Safe Content'}
                        color={results.is_bullying ? 'error' : 'success'}
                        variant="filled"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>

                    {results.categories && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Detected Categories
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                          {Object.entries(results.categories).map(([category, score]) => (
                            score > 0.5 && (
                              <Chip
                                key={category}
                                label={`${category} (${Math.round(score * 100)}%)`}
                                size="small"
                                variant="outlined"
                              />
                            )
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'grey.200', width: 64, height: 64 }}>
                      <Robot sx={{ color: 'grey.500', fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      Enter a message and click analyze to see results
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: 'primary.main' }}>
                    <History />
                  </Avatar>
                  <Typography variant="body2" fontWeight="bold">
                    View History
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: 'secondary.main' }}>
                    <Analytics />
                  </Avatar>
                  <Typography variant="body2" fontWeight="bold">
                    Statistics
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: 'warning.main' }}>
                    <Bell />
                  </Avatar>
                  <Typography variant="body2" fontWeight="bold">
                    Alerts
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: 'success.main' }}>
                    <Shield />
                  </Avatar>
                  <Typography variant="body2" fontWeight="bold">
                    Safety Tools
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </Container>
  );
};

export default DashboardHome;
