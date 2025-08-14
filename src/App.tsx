import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import WorkflowTemplates from './pages/WorkflowTemplates';
import MasterSteps from './pages/MasterSteps';
import Categories from './pages/Categories';
import Builds from './pages/Builds';
import ActiveBuilds from './pages/ActiveBuilds';
import SKUs from './pages/SKUs';
import Analytics from './pages/Analytics';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthProvider>
            <Box sx={{ display: 'flex' }}>
              <Layout>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/workflow-templates" element={<WorkflowTemplates />} />
                  <Route path="/master-steps" element={<MasterSteps />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/builds" element={<Builds />} />
                  <Route path="/active-builds" element={<ActiveBuilds />} />
                  <Route path="/skus" element={<SKUs />} />
                  <Route path="/analytics" element={<Analytics />} />
                </Routes>
              </Layout>
            </Box>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
