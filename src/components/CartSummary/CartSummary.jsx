import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Button, Badge, keyframes, useTheme } from '@mui/material';
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
  },
}));

const AnimatedIcon = styled(ShoppingCartIcon)(({ theme }) => ({
  animation: `${bounce} 2s infinite`
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

  if (totalItems === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        width: 'calc(100% - 32px)',
        bgcolor: '#f3f0e9',
        color: '#333',
        p: 2,
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
          <Typography variant="body2" sx={{ color: '#555', fontWeight: 'bold' }}>
            Total Pedido
          </Typography>
          <Typography variant="h6">
            {formatCurrency(totalPrice)}
          </Typography>
        </Box>
      </Box>
      <Button
        variant="contained"
        sx={{
          bgcolor: theme.palette.primary.main,
          '&:hover': {
            bgcolor: theme.palette.custom.hoover,
          },
          borderRadius: '20px',
          color: theme.palette.custom.light,
          
        }}
        onClick={onViewCart}
      >
        Ordenar
      </Button>
    </Box>
  );
}

export default CartSummary;


