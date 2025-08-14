import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  Avatar,
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiService, { StaffLoginRequest } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [staffNumber, setStaffNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: (request: StaffLoginRequest) => apiService.loginStaff(request),
    onSuccess: (response) => {
      if (response.success && response.staff) {
        // Use AuthContext to login
        login(response.staff);
        
        // Redirect to dashboard or main page
        navigate('/');
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!staffNumber.trim()) {
      setError('Please enter your staff number.');
      return;
    }

    const staffNumberInt = parseInt(staffNumber.trim());
    if (isNaN(staffNumberInt)) {
      setError('Please enter a valid staff number.');
      return;
    }

    loginMutation.mutate({ staffNumber: staffNumberInt });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlined />
          </Avatar>
          
          <Typography component="h1" variant="h5" gutterBottom>
            Staff Login
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Enter your staff number to access the manufacturing line workflow system
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="staffNumber"
              label="Staff Number"
              name="staffNumber"
              type="number"
              autoComplete="off"
              autoFocus
              value={staffNumber}
              onChange={(e) => setStaffNumber(e.target.value)}
              placeholder="Enter your staff number"
              disabled={loginMutation.isPending}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loginMutation.isPending || !staffNumber.trim()}
            >
              {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            Need help? Contact your supervisor or system administrator.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
