import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Typography, Button, Modal, IconButton, TextField, useTheme, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { addToCart } from '../../redux/cartSlice';

function ProductModal({ product, open, onClose }) {
  const [quantity, setQuantity] = useState('1');
  const dispatch = useDispatch();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md')); // Detecta si la pantalla es grande

  useEffect(() => {
    if (open) {
      setQuantity('1');
    }
  }, [open]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleQuantityChange = (event) => {
    const value = event.target.value;
    if (!isNaN(value) && Number(value) > 0) {
      setQuantity(value);
    } else if (value === '') {
      setQuantity(value);
    }
  };

  const handleAddToOrder = () => {
    const quantityNumber = parseInt(quantity, 10);
    if (!isNaN(quantityNumber) && quantityNumber > 0) {
      const priceWithDiscount = product.descuento > 0 ? product.precio * (1 - product.descuento / 100) : product.precio;
      dispatch(addToCart({
        id: product.id,
        name: product.nombre,
        price: priceWithDiscount,
        image: product.imagen_url,
        quantity: quantityNumber
      }));
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto'
      }}
    >
      <Box sx={{
        position: 'relative',
        width: '90%',
        maxWidth: isLargeScreen ? 1000 : 500, // Incrementa el ancho máximo en pantallas grandes
        maxHeight: isLargeScreen ? '90vh' : '80vh', // Incrementa la altura máxima en pantallas grandes
        bgcolor: 'background.paper',
        pt: 5,
        pb: 3,
        pl: isLargeScreen ? 5 : 3, // Ajusta el padding izquierdo en pantallas grandes
        pr: isLargeScreen ? 5 : 3, // Ajusta el padding derecho en pantallas grandes
        borderRadius: 3,
        boxShadow: 24,
        m: 2,
        animation: 'fade-in 300ms ease-out',
        overflowY: 'auto'
      }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.900' }}>
          <CloseIcon />
        </IconButton>
        <Box sx={{ display: 'flex', flexDirection: isLargeScreen ? 'row' : 'column', alignItems: 'center' }}>
          <img src={product.imagen_url} alt={product.nombre} style={{ width: isLargeScreen ? '50%' : '100%', borderRadius: '8px', marginBottom: isLargeScreen ? '0' : '16px', marginRight: isLargeScreen ? '16px' : '0' }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mt: 2 }}> {/* Incrementa el tamaño del texto */}
              {product.nombre}
            </Typography>
            {product.descuento > 0 ? (
              <>
                <Typography variant="body1" sx={{ textDecoration: 'line-through' }}>
                  {formatCurrency(product.precio)}
                </Typography>
                <Typography variant="h6" sx={{ color: 'red' }}> {/* Incrementa el tamaño del texto */}
                  {formatCurrency(product.precio * (1 - product.descuento / 100))}
                </Typography>
              </>
            ) : (
              <Typography variant="h5" sx={{ my: 2, fontWeight: 'medium' }}> {/* Incrementa el tamaño del texto */}
                {formatCurrency(product.precio)}
              </Typography>
            )}
            <Typography variant="overline" display="block" sx={{ mb: 1, fontWeight: 'bold' }}>
              Descripción
            </Typography>
            <Typography sx={{ mb: 2 }}>
              {product.descripcion}
            </Typography>
            <TextField
              fullWidth
              label="Cantidad"
              type="text"
              variant="outlined"
              value={quantity}
              onChange={handleQuantityChange}
              inputProps={{ min: 1, pattern: '[0-9]*' }}
              sx={{ mb: 2 }}
            />
            <Button
              startIcon={<ShoppingCartIcon />}
              variant="contained"
              sx={{
                backgroundColor: theme.palette.primary.main,
                '&:hover': { backgroundColor: theme.palette.custom.light },
                color: theme.palette.custom.light,
                fontFamily: 'Poppins',
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '17px',
                fontWeight: 'bold',
                mb: 2,
                width: '100%'
              }}
              onClick={handleAddToOrder}
            >
              Agregar a la orden
            </Button>
            <TextField
              fullWidth
              label="Comentario"
              variant="outlined"
              multiline
              rows={3}
              placeholder="Agrega un comentario sobre tu pedido"
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default ProductModal;


