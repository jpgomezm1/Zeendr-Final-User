import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Button, Badge, keyframes, useTheme, useMediaQuery } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { styled } from '@mui/material/styles';

export const selectTotalItems = (state) => state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectTotalPrice = (state) => state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    fontSize: '1rem', // Ajusta el tamaño del texto en el badge
  },
}));

const AnimatedIcon = styled(ShoppingCartIcon)(({ theme }) => ({
  animation: `${bounce} 2s infinite`,
  fontSize: '2rem', // Ajusta el tamaño del icono
}));

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const CartSummary = ({ onViewCart }) => {
  const totalItems = useSelector(selectTotalItems);
  const totalPrice = useSelector(selectTotalPrice);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  if (totalItems === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 15,
        left: isLargeScreen ? 'calc(50% - 400px)' : 16, // Ajusta la posición en pantallas grandes
        right: isLargeScreen ? 'calc(50% - 400px)' : 16, // Ajusta la posición en pantallas grandes
        width: isLargeScreen ? '800px' : 'calc(100% - 32px)', // Ajusta el ancho en pantallas grandes
        bgcolor: '#f3f0e9',
        color: '#333',
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '16px',
        zIndex: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledBadge badgeContent={totalItems} color="primary">
          <AnimatedIcon />
        </StyledBadge>
        <Box sx={{ ml: 4 }}>
          <Typography variant="body1" sx={{ color: '#555', fontWeight: 'bold', fontSize: isLargeScreen ? '1.5rem' : '1rem' }}>
            Total Pedido
          </Typography>
          <Typography variant="h5" sx={{ fontSize: isLargeScreen ? '2.5rem' : '1.5rem' }}>
            {formatCurrency(totalPrice)}
          </Typography>
        </Box>
      </Box>
      <Button
        variant="contained"
        sx={{
          bgcolor: theme.palette.primary.main,
          '&:hover': {
            bgcolor: theme.palette.custom.hover,
          },
          borderRadius: '20px',
          color: theme.palette.custom.light,
          fontSize: isLargeScreen ? '1.5rem' : '1rem', // Ajusta el tamaño del texto en el botón
          padding: isLargeScreen ? '16px 32px' : '8px 16px', // Ajusta el padding en pantallas grandes
        }}
        onClick={onViewCart}
      >
        Ordenar
      </Button>
    </Box>
  );
}

export default CartSummary;
