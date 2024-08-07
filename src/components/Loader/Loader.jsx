import React from 'react';
import { Box, keyframes } from '@mui/material';
import matrizLogo from '../../assets/irre-logo.png'; 

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
`;

const Loader = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', backgroundColor: '#fff' }}>
      <Box sx={{ animation: `${bounce} 2s infinite`, mb: 4 }}>
        <img src={matrizLogo} alt="Logo de la casa matriz" style={{ width: 500 }} />
      </Box>
    </Box>
  );
};

export default Loader;
