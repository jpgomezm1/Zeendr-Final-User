import React from 'react';
import { Box, CardMedia, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';

const OfferCircle = styled(Box)(({ theme, isLargeScreen }) => ({
  width: isLargeScreen ? '280px' : '80px', // Ajusta el tamaño en pantallas grandes
  height: isLargeScreen ? '280px' : '80px', // Ajusta el tamaño en pantallas grandes
  borderRadius: '50%',
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: isLargeScreen ? '30px' : '8px', // Ajusta el margen para mayor separación en pantallas grandes
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s', // Efecto de transición
  '&:hover': {
    transform: 'scale(1.05)', // Escala al 105% cuando se pasa el cursor
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', // Sombra más prominente
  },
}));

const OfferImage = styled(CardMedia)({
  width: '100%',
  height: '100%',
  objectFit: 'cover'
});

const DiscountBadge = styled(Box)(({ theme, isLargeScreen }) => ({
  backgroundColor: 'red',
  color: 'white',
  padding: isLargeScreen ? '4px 12px' : '2px 6px', // Ajusta el padding en pantallas grandes
  borderRadius: '10px',
  fontSize: isLargeScreen ? '16px' : '10px', // Ajusta el tamaño de la fuente en pantallas grandes
  textAlign: 'center',
  position: 'absolute',
  bottom: isLargeScreen ? '16px' : '8px' // Ajusta la posición en pantallas grandes
}));

const OffersSection = ({ products, handleOpenModal }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md')); // Detecta si la pantalla es grande
  const offerProducts = products.filter(product => product.descuento > 0);

  return (
    <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: isLargeScreen ? 'center' : 'flex-start', flexWrap: isLargeScreen ? 'wrap' : 'nowrap', overflowX: isLargeScreen ? 'hidden' : 'auto', padding: '16px 0' }}>
        {offerProducts.map(product => (
          <Box key={product.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', mt: 2, mb: 2, cursor: 'pointer'}}>
            <OfferCircle onClick={() => handleOpenModal(product)} isLargeScreen={isLargeScreen}>
              <OfferImage
                component="img"
                image={product.imagen_url}
                alt={product.nombre}
              />
              {product.descuento > 0 && (
                <DiscountBadge isLargeScreen={isLargeScreen}>
                  {product.descuento}% OFF
                </DiscountBadge>
              )}
            </OfferCircle>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OffersSection;
