import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton, Grid, Card, CardMedia, TextField, Divider, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { removeFromCart, updateQuantity } from '../../redux/cartSlice';
import CloseIcon from '@mui/icons-material/Close';
import { useEstablecimiento } from '../../App'; // Importa el contexto

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  borderRadius: '12px',
}));

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const CartPage = () => {
  const { establecimiento } = useEstablecimiento();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate(-1);  // Redirige a la ruta anterior
    }
  }, [cartItems, navigate]);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleContinueShopping = () => {
    navigate(`/${establecimiento}`);  // Redirige a la página de productos
  };

  const handleProceedToCheckout = () => {
    navigate(`/${establecimiento}/checkout`);  // Redirige a la página de checkout
  };

  return (
    <Box sx={{ pt: isLargeScreen ? '120px' : '0', p: 2, pb: totalItems > 0 ? 20 : 2, maxWidth: { xs: '100%', md: '80%' }, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 2, fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Mi Pedido
      </Typography>
      <Typography variant="body2" sx={{ mb: 1, color: 'gray', fontSize: { xs: '1.3rem', md: '1.5rem' } }}>
        {cartItems.length > 0 && cartItems.map(item => `${item.quantity} x ${item.name}`).join(', ')}
      </Typography>
      <Typography variant="h5" sx={{ mb: 4, color: theme.palette.primary.main, fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2rem' } }}>
        {formatCurrency(totalPrice)} Total Productos
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {cartItems.map((item) => (
          <Grid item xs={12} key={item.id}>
            <StyledCard>
              <CardMedia
                component="img"
                image={item.image}
                alt={item.name}
                sx={{ width: { xs: 60, md: 80 }, height: { xs: 60, md: 80 }, borderRadius: '8px' }}
              />
              <Box sx={{ flex: 1, mx: 2 }}>
                <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>{item.name}</Typography>
                <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>{formatCurrency(item.price)}</Typography>
                <TextField
                  type="number"
                  label="Cantidad"
                  variant="outlined"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                  inputProps={{ min: 1 }}
                  sx={{ mt: 1, width: { xs: 80, md: 100 } }}
                />
              </Box>
              <IconButton onClick={() => handleRemove(item.id)}>
                <CloseIcon />
              </IconButton>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
        <Button 
          variant="contained" 
          color="secondary" 
          sx={{ 
            bgcolor: '#555', 
            '&:hover': { bgcolor: '#777' }, 
            borderRadius: '16px', 
            width: { xs: '100%', md: '45%' }, 
            fontWeight: 'bold', 
            mb: { xs: 2, md: 0 }, 
            fontSize: { xs: '1rem', md: '1.25rem' } // Ajusta el tamaño del texto en el botón 
          }}
          onClick={handleContinueShopping} // Llama a la función de continuar comprando
        >
          Sigue Comprando
        </Button>
        <Button 
          variant="contained" 
          sx={{ 
            backgroundColor: theme.palette.primary.main, 
            '&:hover': { backgroundColor: theme.palette.custom.hover }, 
            color: theme.palette.custom.light, 
            borderRadius: '16px', 
            width: { xs: '100%', md: '45%' }, 
            fontWeight: 'bold', 
            fontSize: { xs: '1rem', md: '1.25rem' } // Ajusta el tamaño del texto en el botón 
          }} 
          onClick={handleProceedToCheckout}
        >
          Proceder al Pago
        </Button>
      </Box>
    </Box>
  );
};

export default CartPage;
