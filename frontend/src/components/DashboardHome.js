import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import MessageIcon from "@mui/icons-material/Message";
import SecurityIcon from "@mui/icons-material/Security";
import PeopleIcon from "@mui/icons-material/People";

const DashboardHome = () => {

  const stats = [
    {
      title: "Messages Analyzed",
      value: "1,240",
      icon: <MessageIcon fontSize="large" color="primary" />
    },
    {
      title: "Harassment Detected",
      value: "145",
      icon: <WarningIcon fontSize="large" color="error" />
    },
    {
      title: "Protected Users",
      value: "320",
      icon: <PeopleIcon fontSize="large" color="success" />
    },
    {
      title: "Safety Score",
      value: "87%",
      icon: <SecurityIcon fontSize="large" color="secondary" />
    }
  ];

  const alerts = [
    {
      user: "cool_kid_99",
      message: "Lol ur so ugly I can't even look at ur profile pic",
      type: "Appearance Harassment",
      confidence: 87
    },
    {
      user: "shadow_x",
      message: "If you come to school tomorrow you'll regret it",
      type: "Physical Threat",
      confidence: 95
    },
    {
      user: "team_captain_22",
      message: "Everyone agrees you're the worst player",
      type: "Social Exclusion",
      confidence: 79
    }
  ];

  return (
    <Box sx={{ p: 4 }}>

      {/* Page Title */}
      <Typography variant="h4" gutterBottom>
        Cyberbullying Detection Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} md={3} key={index}>
            <Card elevation={3}>
              <CardContent>

                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography variant="h6">
                      {stat.title}
                    </Typography>

                    <Typography variant="h4">
                      {stat.value}
                    </Typography>
                  </Box>

                  {stat.icon}
                </Box>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Alerts Section */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Recent Alerts
      </Typography>

      <Grid container spacing={3}>
        {alerts.map((alert, index) => (
          <Grid item xs={12} md={4} key={index}>

            <Paper sx={{ p: 3 }} elevation={3}>

              <Typography fontWeight="bold">
                {alert.user}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                {alert.message}
              </Typography>

              <Typography sx={{ mt: 2 }} color="error">
                {alert.type}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Confidence: {alert.confidence}%
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={alert.confidence}
                  color="error"
                />
              </Box>

            </Paper>

          </Grid>
        ))}
      </Grid>

      {/* Safety Tools Section */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Safety Tools
        </Typography>

        <Paper sx={{ p: 3 }} elevation={2}>
          <Typography>
            ✔ Report abusive messages
          </Typography>

          <Typography>
            ✔ Block cyberbullying users
          </Typography>

          <Typography>
            ✔ Monitor harmful language
          </Typography>

          <Typography>
            ✔ Provide safe online communication
          </Typography>
        </Paper>
      </Box>

    </Box>
  );
};

export default DashboardHome;