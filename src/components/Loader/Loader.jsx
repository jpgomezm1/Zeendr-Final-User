import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import matrizLogo from '../../assets/logo33.png';  // Asegúrate de que la ruta al logo sea correcta
import matrizLogo2 from '../../assets/animacion2.gif';

const Loader = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', backgroundColor: '#fff' }}>
      <img src={matrizLogo2} alt="Logo de la casa matriz" style={{ width: 200, marginBottom: '16px' }} />
      <img src={matrizLogo} alt="Logo de la casa matriz" style={{ width: 200, marginBottom: '16px' }} />
    </Box>
  );
};

export default Loader;
