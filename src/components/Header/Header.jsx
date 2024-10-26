import React from 'react';
import { Grid, Box, TextField, useTheme, useMediaQuery, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { keyframes } from '@emotion/react';
import { useParams } from 'react-router-dom';

// Definimos la animación para el texto
const scrollText = keyframes`
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
`;

function Header({ logo, searchTerm, setSearchTerm }) {
  const { establecimiento } = useParams(); // Obtiene el parámetro 'establecimiento' de la URL
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detecta si la pantalla es pequeña

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: '#FFA726', // Fondo naranja para el texto animado
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          p: 1,
          mb: 2,
          position: 'relative',
          width: '100%'
        }}
      >
        <Box
          sx={{
            display: 'inline-block',
            animation: `${scrollText} 25s linear infinite`,
            whiteSpace: 'nowrap',
          }}
        >
          {[...Array(8)].map((_, index) => (
            <Typography
              key={index}
              variant="subtitle1"
              component="span"
              sx={{
                display: 'inline-block',
                mx: 2,
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              {establecimiento.toUpperCase()} — ¡CONOCE NUESTRA MARCA! — SÍGUENOS EN REDES 
            </Typography>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          p: 2,
          backgroundColor: '#FFFBF5',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Agrega una sombra solo en la parte inferior
          mb: 4
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={2}>
            <img 
              src={logo} 
              alt="Logo de Cafe Madriguera" 
              style={{ 
                maxWidth: isMobile ? '50%' : '100%', // Aplica diferentes estilos según el tamaño de la pantalla
                display: 'block', 
                margin: '0 auto' 
              }} 
            />
          </Grid>
          <Grid item xs={12} md={10}>
            <TextField 
              fullWidth 
              label="Buscar productos" 
              variant="outlined" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              sx={{
                ml: isMobile ? 0 : 2, // Margen izquierdo en pantallas grandes
                maxWidth: isMobile ? '100%' : '80%',
                borderRadius: '20px', // Agrega borde redondeado
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px', // Asegura que el borde redondeado se aplique al contenedor del input
                },
              }}
              InputProps={{
                endAdornment: <SearchIcon />
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Header;
