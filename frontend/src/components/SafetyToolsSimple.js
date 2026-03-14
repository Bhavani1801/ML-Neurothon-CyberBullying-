import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button, Chip, Alert } from '@mui/material';
import { Report, Shield, Lock, School, FamilyRestroom, SupportAgent, HealthAndSafety, Emergency, ContactPhone } from '@mui/icons-material';

const SafetyTools = () => {
  const tools = [
    {
      name: 'Report Incident',
      type: 'REPORTING',
      description: 'Report cyberbullying incidents safely and anonymously',
      icon: <Report color="error" />
    },
    {
      name: 'Protection Tools',
      type: 'PROTECTION', 
      description: 'Protect yourself from harmful content and interactions',
      icon: <Shield color="warning" />
    },
    {
      name: 'Privacy Settings',
      type: 'PRIVACY',
      description: 'Control your privacy and manage your digital footprint',
      icon: <Lock color="info" />
    },
    {
      name: 'Safety Education',
      type: 'EDUCATION',
      description: 'Learn about online safety and digital citizenship',
      icon: <School color="success" />
    },
    {
      name: 'Parental Controls',
      type: 'PARENTAL',
      description: 'Monitor and protect your children online',
      icon: <FamilyRestroom color="primary" />
    },
    {
      name: 'Support Center',
      type: 'SUPPORT',
      description: 'Get help when you need it most',
      icon: <SupportAgent color="secondary" />
    }
  ];

  const handleToolClick = (toolName) => {
    alert(`${toolName} clicked! This tool is now active.`);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
        Safety Tools & Resources
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Comprehensive protection and support for a safer online experience
      </Typography>

      <Alert severity="info" sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <HealthAndSafety />
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              Your Safety is Our Priority
            </Typography>
            <Typography variant="body2">
              Use these tools to protect yourself and others from online harm.
            </Typography>
          </Box>
        </Box>
      </Alert>

      {/* Emergency Actions */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#fff3cd', border: '2px solid #ffc107' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#856404' }}>
          🚨 Emergency Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="contained" color="error" size="large" fullWidth startIcon={<Emergency />}>
              Emergency Call
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="contained" color="warning" size="large" fullWidth startIcon={<Report />}>
              Report Abuse
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="contained" color="info" size="large" fullWidth startIcon={<ContactPhone />}>
              Contact Helpline
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="contained" color="success" size="large" fullWidth startIcon={<Shield />}>
              Block User
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Safety Tools Grid */}
      <Paper sx={{ p: 3, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
          Safety Tools
        </Typography>
        <Grid container spacing={3}>
          {tools.map((tool, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                  },
                  cursor: 'pointer'
                }}
                onClick={() => handleToolClick(tool.name)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {tool.icon}
                    <Chip
                      label={tool.type}
                      size="small"
                      sx={{ ml: 'auto' }}
                      color="primary"
                    />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {tool.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tool.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2 }}
                    fullWidth
                  >
                    Use Tool
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default SafetyTools;
