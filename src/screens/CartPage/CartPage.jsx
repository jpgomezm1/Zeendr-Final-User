import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton, Grid, Card, CardMedia, TextField, Divider, useTheme  } from '@mui/material';
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

const CartPage = () => {
  const { establecimiento } = useEstablecimiento();
  const dispatch = useDispatch();
  const navigate = useNavigate();  // Utilizamos useNavigate
  const cartItems = useSelector((state) => state.cart.items);
  const theme = useTheme();

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
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Mi Pedido
      </Typography>
      <Typography variant="body2" sx={{ mb: 1, color: 'gray' }}>
        {cartItems.length > 0 && cartItems.map(item => `${item.quantity} x ${item.name}`).join(', ')}
      </Typography>
      <Typography variant="h5" sx={{ mb: 4, color: theme.palette.primary.main, fontWeight: 'bold' }}>
        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalPrice)} Total Productos
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
                sx={{ width: 80, height: 80, borderRadius: '8px' }}
              />
              <Box sx={{ flex: 1, mx: 2 }}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body1">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.price)}</Typography>
                <TextField
                  type="number"
                  label="Cantidad"
                  variant="outlined"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                  inputProps={{ min: 1 }}
                  sx={{ mt: 1, width: 100 }}
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
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          variant="contained" 
          color="secondary" 
          sx={{ bgcolor: '#555', '&:hover': { bgcolor: '#777' }, borderRadius: '16px', width: '45%', ml: 1 }}
          onClick={handleContinueShopping} // Llama a la función de continuar comprando
        >
          Sigue Comprando
        </Button>
        <Button variant="contained" sx={{ backgroundColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.custom.hoover }, color: theme.palette.custom.light, borderRadius: '16px', width: '45%', mr: 1, fontWeight: 'bold' }} onClick={handleProceedToCheckout}>
          Proceder al Pago
        </Button>
      </Box>
    </Box>
  );
};

export default CartPage;
