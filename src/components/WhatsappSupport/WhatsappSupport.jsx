import React from 'react';
import { Box, useTheme } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const WhatsappSupport = ({ whatsappUrl }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        cursor: 'pointer',
        backgroundColor: '#25D366',
        borderRadius: '50%',
        padding: '16px',
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        animation: 'slideIn 0.5s forwards',
        '&:hover': {
          backgroundColor: '#128C7E',
          transform: 'scale(1.1)',
          boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.4)',
        },
        '@keyframes slideIn': {
          '0%': {
            opacity: 0,
            transform: 'translateY(100px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
      onClick={() => window.open(whatsappUrl, '_blank')}
    >
      <WhatsAppIcon sx={{ color: 'white', fontSize: 48 }} />
    </Box>
  );
};

export default WhatsappSupport;
