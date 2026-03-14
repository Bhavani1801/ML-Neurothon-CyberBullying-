import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Link,
  Search,
  Analytics,
  Warning,
  CheckCircle,
  Message,
  TrendingUp,
  People,
  SentimentVeryDissatisfied,
  SentimentSatisfied,
  Security,
  Public,
  Instagram,
  Facebook,
  Twitter
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { analyzeSocialMedia } from '../services/api';

const SocialMediaAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const validateSocialMediaUrl = (url) => {
    const patterns = {
      instagram: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/p\/[a-zA-Z0-9_-]+/,
      instagramProfile: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/[a-zA-Z0-9_.]+/,
      facebook: /(?:https?:\/\/)?(?:www\.)?facebook\.com\/[a-zA-Z0-9_.-]+\/posts\/[a-zA-Z0-9_-]+/,
      twitter: /(?:https?:\/\/)?(?:www\.)?twitter\.com\/[a-zA-Z0-9_]+\/status\/[a-zA-Z0-9]+/,
      youtube: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+/,
      tiktok: /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[a-zA-Z0-9_.]+\/video\/[a-zA-Z0-9_-]+/
    };

    for (const [platform, pattern] of Object.entries(patterns)) {
      if (pattern.test(url)) {
        return platform;
      }
    }
    return null;
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram':
      case 'instagramProfile':
        return <Instagram sx={{ color: '#E4405F' }} />;
      case 'facebook':
        return <Facebook sx={{ color: '#1877F2' }} />;
      case 'twitter':
        return <Twitter sx={{ color: '#1DA1F2' }} />;
      default:
        return <Public sx={{ color: '#666' }} />;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);

    const platform = validateSocialMediaUrl(url);
    if (!platform) {
      setError('Please enter a valid social media URL (Instagram, Facebook, Twitter, YouTube, or TikTok)');
      setLoading(false);
      return;
    }

    try {
      const response = await analyzeSocialMedia({ url, platform });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze social media content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH': return 'error';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'info';
      default: return 'success';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'error';
    if (confidence >= 0.6) return 'warning';
    return 'success';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b' }}>
            Social Media Analyzer
          </Typography>
          <Typography variant="h6" color="#64748b" sx={{ mb: 2 }}>
            Analyze comments from your social media posts for cyberbullying content
          </Typography>
          <Typography variant="body2" color="#94a3b8">
            Enter a post URL from Instagram, Facebook, Twitter, YouTube, or TikTok
          </Typography>
        </Box>

        {/* URL Input Form */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Social Media Post URL"
              placeholder="https://instagram.com/p/ABC123 or https://twitter.com/username/status/123456"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              margin="normal"
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                    borderWidth: 2,
                  },
                },
              }}
              InputProps={{
                startAdornment: <Link sx={{ mr: 1, color: '#64748b' }} />,
              }}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || !url}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Search />}
            >
              {loading ? 'Analyzing...' : 'Analyze Comments'}
            </Button>
          </Box>
        </Paper>

        {/* Results */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={3}>
                <Card elevation={3}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6" color="#64748b">
                          Total Comments
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {results.totalComments}
                        </Typography>
                      </Box>
                      <Message fontSize="large" color="primary" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card elevation={3}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6" color="#64748b">
                          Abusive Comments
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color="error">
                          {results.abusiveComments}
                        </Typography>
                      </Box>
                      <Warning fontSize="large" color="error" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card elevation={3}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6" color="#64748b">
                          Safe Comments
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color="success.main">
                          {results.safeComments}
                        </Typography>
                      </Box>
                      <CheckCircle fontSize="large" color="success" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card elevation={3}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6" color="#64748b">
                          Risk Level
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {results.riskLevel}%
                        </Typography>
                      </Box>
                      <TrendingUp fontSize="large" color={getConfidenceColor(results.riskLevel / 100)} />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={results.riskLevel}
                      color={getConfidenceColor(results.riskLevel / 100)}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Detailed Analysis Tabs */}
            <Paper elevation={3}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="Overview" icon={<Analytics />} />
                <Tab label="Abusive Comments" icon={<Warning />} />
                <Tab label="Safe Comments" icon={<CheckCircle />} />
                <Tab label="Categories" icon={<Security />} />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {/* Overview Tab */}
                {tabValue === 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Analysis Overview
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1" gutterBottom>
                          <strong>Platform:</strong> {results.platform}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Post URL:</strong> {results.postUrl}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Analysis Date:</strong> {new Date(results.analyzedAt).toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1" gutterBottom>
                          <strong>Detection Accuracy:</strong> {results.accuracy}%
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Average Confidence:</strong> {(results.avgConfidence * 100).toFixed(1)}%
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Processing Time:</strong> {results.processingTime}s
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Abusive Comments Tab */}
                {tabValue === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Abusive Comments ({results.abusiveComments})
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Comment</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Confidence</TableCell>
                            <TableCell>Severity</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {results.abusiveCommentDetails?.map((comment, index) => (
                            <TableRow key={index}>
                              <TableCell sx={{ maxWidth: 300 }}>{comment.text}</TableCell>
                              <TableCell>
                                <Chip
                                  label={comment.category}
                                  size="small"
                                  color={getSeverityColor(comment.severity)}
                                />
                              </TableCell>
                              <TableCell>
                                <LinearProgress
                                  variant="determinate"
                                  value={comment.confidence * 100}
                                  color={getConfidenceColor(comment.confidence)}
                                  sx={{ width: 100 }}
                                />
                                <Typography variant="body2">
                                  {(comment.confidence * 100).toFixed(1)}%
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={comment.severity}
                                  size="small"
                                  color={getSeverityColor(comment.severity)}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {/* Safe Comments Tab */}
                {tabValue === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Safe Comments ({results.safeComments})
                    </Typography>
                    <List>
                      {results.safeCommentDetails?.map((comment, index) => (
                        <ListItem key={index} divider>
                          <ListItemIcon>
                            <CheckCircle color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary={comment.text}
                            secondary={`Confidence: ${(comment.confidence * 100).toFixed(1)}%`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Categories Tab */}
                {tabValue === 3 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Abuse Categories Breakdown
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.entries(results.categories || {}).map(([category, count]) => (
                        <Grid item xs={12} sm={6} md={4} key={category}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="h6" textTransform="capitalize">
                                {category.replace('_', ' ')}
                              </Typography>
                              <Typography variant="h4" color="primary">
                                {count}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            </Paper>
          </motion.div>
        )}
      </motion.div>
    </Container>
  );
};

export default SocialMediaAnalyzer;
