import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function ActiveBuilds() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Active Builds
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Monitor builds currently in progress
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Active Builds page coming soon...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This page will show all builds currently in progress with real-time step tracking and worker assignments.
        </Typography>
      </Paper>
    </Box>
  );
}
