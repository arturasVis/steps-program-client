import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function Builds() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Builds
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage PC build orders and track progress
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Builds page coming soon...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This page will allow you to create new builds, assign workflows, and track build progress.
        </Typography>
      </Paper>
    </Box>
  );
}
