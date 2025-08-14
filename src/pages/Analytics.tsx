import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function Analytics() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Performance metrics and insights
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Analytics page coming soon...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This page will provide detailed performance analytics, worker efficiency metrics, and build time analysis.
        </Typography>
      </Paper>
    </Box>
  );
}
