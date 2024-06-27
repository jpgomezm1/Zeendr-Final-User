import React from 'react';
import { Box, CardMedia } from '@mui/material';
import { styled } from '@mui/material/styles';

const OfferCircle = styled(Box)(({ theme }) => ({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 8px',
  flexDirection: 'column',
}));

const OfferImage = styled(CardMedia)({
  width: '100%',
  height: '100%',
  objectFit: 'cover'
});

const DiscountBadge = styled(Box)(({ theme }) => ({
  backgroundColor: 'red',
  color: 'white',
  padding: '2px 6px',
  borderRadius: '10px',
  fontSize: '10px',
  textAlign: 'center',
  marginTop: '4px',
  position: 'absolute',
  bottom: '-20px'
}));

const OffersSection = ({ products, handleOpenModal }) => {
  const offerProducts = products.filter(product => product.descuento > 0);

  return (
    <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', overflowX: 'auto', padding: '8px 0' }}>
        {offerProducts.map(product => (
          <Box key={product.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', mt: 1, mb: 2 }}>
            <OfferCircle onClick={() => handleOpenModal(product)}>
              <OfferImage
                component="img"
                image={product.imagen_url}
                alt={product.nombre}
              />
            </OfferCircle>
            {product.descuento > 0 && (
              <DiscountBadge>
                {product.descuento}% OFF
              </DiscountBadge>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OffersSection;
