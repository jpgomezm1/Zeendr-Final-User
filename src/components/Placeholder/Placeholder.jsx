import React from 'react';
import { Box } from '@mui/material';

const Placeholder = () => (
  <Box sx={{ 
    width: '100%', 
    height: '100%', 
    backgroundColor: '#f0f0f0', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  }}>
    <span>Loading...</span>
  </Box>
);

export default Placeholder;
