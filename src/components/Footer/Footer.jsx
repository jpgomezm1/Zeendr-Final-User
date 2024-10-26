import React from 'react';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import instagramIcon from '../../assets/insta.png';
import whatsappIcon from '../../assets/wpp.png';
import tiktokIcon from '../../assets/tiktok.png';
import { useEstablecimiento } from '../../App'; // Importa el contexto
import { useParams } from 'react-router-dom';
 

import './Footer.css';

const Footer = () => {
  const { logoUrl, instagramUrl, tiktokUrl, whatsappUrl } = useEstablecimiento(); // Obtén las URLs del contexto
  const navigate = useNavigate();
  const { establecimiento } = useParams();
  const currentYear = new Date().getFullYear();

  const handleLogoClick = () => {
    navigate('/about');
  };

  const handleZeendrLogoClick = () => {
    window.open('https://www.irrelevant-club.com/', '_blank');
  };

  const toTitleCase = (str) => {
    return str.toLowerCase().split(' ').map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  };

  return (
    <Box sx={{ mt: 6, backgroundColor: '#fff', textAlign: 'center', borderTop: '1px solid #ddd', p: { xs: 2, md: 4 } }} elevation={0}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={3}>
          <Box sx={{ mb: 1, cursor: 'pointer', animation: 'bounce 2s infinite' }} onClick={handleLogoClick}>
            <img
              src={logoUrl}
              alt="Logo de Madriguera"
              style={{ width: '150px', marginBottom: '10px', transition: 'transform 0.3s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
            />
          </Box>
          <Typography variant="body1" sx={{ color: '#333' }}>
            © {currentYear} {toTitleCase(establecimiento)}. Todos los derechos reservados.
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{ mb: { xs: 1, md: 2 }, fontSize: { xs: '1.2rem', md: '1.5rem' }, color: '#333' }}>
            Síguenos
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 2, md: 2 }, mb: { xs: 2, md: 3 } }}>
            {instagramUrl && (
              <IconButton href={instagramUrl} target="_blank" sx={{ p: 0 }}>
                <img src={instagramIcon} alt="Instagram" style={{ width: '25px', height: '25px' }} />
              </IconButton>
            )}
            {tiktokUrl && (
              <IconButton href={tiktokUrl} target="_blank" sx={{ p: 0 }}>
                <img src={tiktokIcon} alt="TikTok" style={{ width: '25px', height: '25px' }} />
              </IconButton>
            )}
            {whatsappUrl && (
              <IconButton href={whatsappUrl} target="_blank" sx={{ p: 0 }}>
                <img src={whatsappIcon} alt="WhatsApp" style={{ width: '25px', height: '25px' }} />
              </IconButton>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>

          <Box sx={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }} onClick={handleZeendrLogoClick}>
            <img
              src="https://storage.googleapis.com/comprobantes-madriguera/multimediaFeria/devby.png"
              alt="Logo Zeendr"
              style={{ width: '200px', transition: 'transform 0.3s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
