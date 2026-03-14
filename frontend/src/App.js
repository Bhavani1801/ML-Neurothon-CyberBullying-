import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';

import Login from './components/Login';
import Register from "./components/Register";
import DashboardLayout from './components/Dashboard';
import DashboardHome from './components/DashboardHome';
import MessageAnalyzer from './components/MessageAnalyzer';
import Statistics from './components/Statistics';
import History from './components/History';
import Alerts from './components/Alerts';
import SafetyTools from './components/SafetyTools';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>

            {/* Login Page */}
            <Route path="/login" element={<Login />} />

            {/* Register Page */}
            <Route path="/register" element={<Register />} />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardHome />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Analyzer */}
            <Route
              path="/analyzer"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <MessageAnalyzer />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Safety Tools */}
            <Route
              path="/safety-tools"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <SafetyTools />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Statistics */}
            <Route
              path="/statistics"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Statistics />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* History */}
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <History />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Alerts */}
            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Alerts />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Safety Tools */}
            <Route
              path="/safety"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <SafetyTools />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" />} />

          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;