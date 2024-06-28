import React from 'react';
import { Box, keyframes } from '@mui/material';
import matrizLogo from '../../assets/logo33.png';  // Asegúrate de que la ruta al logo sea correcta
import matrizLogo2 from '../../assets/animacion2.gif';

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
      <Box sx={{ animation: `${spin} 2s linear infinite`, mb: 4 }}>
        <img src={matrizLogo2} alt="Animación de la casa matriz" style={{ width: 100 }} />
      </Box>
      <Box sx={{ animation: `${bounce} 2s infinite`, mb: 4 }}>
        <img src={matrizLogo} alt="Logo de la casa matriz" style={{ width: 200 }} />
      </Box>
      <Box>
        <img src={matrizLogo} alt="Logo de la casa matriz" style={{ width: 100, marginTop: '16px', opacity: 0.5 }} />
      </Box>
    </Box>
  );
};

export default Loader;
