import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, FormControl, Paper, Divider, CircularProgress, Backdrop, Select, MenuItem, InputLabel, useTheme, IconButton, InputAdornment } from '@mui/material';
import { CheckCircle, CheckCircleOutline } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { clearCart } from '../../redux/cartSlice';
import { useEstablecimiento } from '../../App';
import AutofillDialog from './AutofillDialog';

const libraries = ['places'];

const CheckoutPage = () => {
  const { establecimiento } = useEstablecimiento();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryCost, setDeliveryCost] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [calculatingCost, setCalculatingCost] = useState(false);
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [fetchedOrder, setFetchedOrder] = useState(null);
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);

  const [accountNumber, setAccountNumber] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    setReceipt(null);
  };

  const handleReceiptUpload = (event) => {
    setReceipt(event.target.files[0]);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const validateForm = () => {
    let valid = true;
    let errors = {};

    if (!name) {
      valid = false;
      errors.name = 'El nombre es requerido';
    }
    if (!email) {
      valid = false;
      errors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      valid = false;
      errors.email = 'El correo electrónico no es válido';
    }
    if (!phone) {
      valid = false;
      errors.phone = 'El número de teléfono es requerido';
    } else if (!/^\d{10}$/.test(phone)) {
      valid = false;
      errors.phone = 'El número de teléfono debe tener 10 dígitos';
    }
    if (!address) {
      valid = false;
      errors.address = 'La dirección es requerida';
    }
    if (!paymentMethod) {
      valid = false;
      errors.paymentMethod = 'El método de pago es requerido';
    }
    if (deliveryCost === null || deliveryCost === 0) {
      valid = false;
      errors.deliveryCost = 'Debe calcular el costo del domicilio';
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('nombre_completo', name);
    formData.append('numero_telefono', phone);
    formData.append('correo_electronico', email);
    formData.append('direccion', address);
    formData.append('productos', JSON.stringify(cartItems));
    formData.append('metodo_pago', paymentMethod);
    formData.append('costo_domicilio', deliveryCost);
    if (receipt) {
      formData.append('comprobante', receipt);
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/pedido?establecimiento=${encodeURIComponent(establecimiento)}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        dispatch(clearCart());
        navigate(`/${establecimiento}/success`, { state: { name } });
      }
    } catch (error) {
      console.error('Error al enviar el pedido:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalculateDeliveryCost = async () => {
    setCalculatingCost(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/calcular_costo?establecimiento=${encodeURIComponent(establecimiento)}`, { destination: address });
      setDeliveryCost(response.data.costo_domicilio);
      setCalculatingCost(false);
      setAddressConfirmed(true);
    } catch (error) {
      console.error('Error al calcular el costo del domicilio:', error);
      setCalculatingCost(false);
    }
  };

  const handleContinueShopping = () => {
    navigate(`/${establecimiento}`);
  };

  const fetchOrderDetails = async (phone) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/pedido/buscar`, {
        params: { numero_telefono: phone }
      });

      if (response.status === 200) {
        const pedido = response.data;
        setFetchedOrder(pedido);
        setOpenDialog(true);
      } else {
        console.log("No se encontraron pedidos para este número de teléfono");
      }
    } catch (error) {
      console.error("Error al buscar pedidos:", error);
    }
  };

  const handleDialogClose = async (autofill) => {
    setOpenDialog(false);
    if (autofill && fetchedOrder) {
      setName(fetchedOrder.nombre_completo);
      setEmail(fetchedOrder.correo_electronico);
      setAddress(fetchedOrder.direccion);
      setPaymentMethod(fetchedOrder.metodo_pago);
      setAddressConfirmed(false);
    }
  };

  useEffect(() => {
    if (phone && phone.length === 10) {
      fetchOrderDetails(phone);
    }
  }, [phone]);

  const handlePlaceSelected = (place) => {
    setAddress(place.formatted_address);
    setAddressConfirmed(false);
  };

  useEffect(() => {
    const fetchEstablecimientoInfo = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/logo?establecimiento=${encodeURIComponent(establecimiento)}`);
        const data = response.data;
        setAccountNumber(data.account_number);
        setQrCodeUrl(data.qr_code_url);
      } catch (error) {
        console.error('Error fetching establecimiento info:', error);
      }
    };

    if (establecimiento) {
      fetchEstablecimientoInfo();
    }
  }, [establecimiento]);

  return (
    <Paper elevation={0} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Información del Pedido
      </Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Número de Teléfono"
          variant="outlined"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={!!errors.phone}
          helperText={errors.phone}
        />
        <TextField
          label="Nombre y Apellido"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Correo Electrónico"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />
        {isLoaded && (
          <Autocomplete
            onLoad={(autocomplete) => setAutocomplete(autocomplete)}
            onPlaceChanged={() => handlePlaceSelected(autocomplete.getPlace())}
          >
            <div style={{ position: 'relative', width: '100%' }}>
              <TextField
                label="Dirección"
                variant="outlined"
                fullWidth
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setAddressConfirmed(false);
                }}
                error={!!errors.address}
                helperText={errors.address}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleCalculateDeliveryCost}
                        disabled={!address || calculatingCost}
                      >
                        {addressConfirmed ? <CheckCircle color="success" /> : <CheckCircleOutline />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ width: '100%' }}
              />
            </div>
          </Autocomplete>
        )}
        {calculatingCost && <CircularProgress size={20} sx={{ mt: 1 }} />}
        {errors.deliveryCost && <Typography variant="body2" color="error">{errors.deliveryCost}</Typography>}
        <FormControl variant="outlined" error={!!errors.paymentMethod}>
          <InputLabel>Método de Pago</InputLabel>
          <Select
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            label="Método de Pago"
          >
            <MenuItem value="Efectivo">Efectivo</MenuItem>
            <MenuItem value="Transferencia">Transferencia</MenuItem>
          </Select>
          {errors.paymentMethod && <Typography variant="body2" color="error">{errors.paymentMethod}</Typography>}
        </FormControl>
        {paymentMethod === 'Transferencia' && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Realiza tu pago escaneando el código QR
            </Typography>
            <img src={qrCodeUrl} alt="QR Code" style={{ width: 200, height: 200 }} />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Total a pagar: {formatCurrency(totalPrice + deliveryCost)}
            </Typography>
            <Typography variant="body1">
              Número de cuenta: {accountNumber}
            </Typography>
            <Button
              variant="contained"
              component="label"
              sx={{ mt: 2 }}
            >
              Cargar Comprobante
              <input
                type="file"
                hidden
                onChange={handleReceiptUpload}
              />
            </Button>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {receipt ? receipt.name : 'Por favor, carga el comprobante de pago'}
            </Typography>
          </Box>
        )}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Resumen del Pedido
        </Typography>
        <Box sx={{ mb: 2 }}>
          {cartItems.map((item) => (
            <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body1">{item.quantity} x {item.name}</Typography>
              <Typography variant="body1">{formatCurrency(item.price * item.quantity)}</Typography>
            </Box>
          ))}
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body1">Domicilio</Typography>
            <Typography variant="body1">{formatCurrency(deliveryCost)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>Total</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>{formatCurrency(totalPrice + deliveryCost)}</Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          sx={{ backgroundColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.custom.hoover }, color: theme.palette.custom.light, borderRadius: '16px', mt: 2 }}
          onClick={handleSubmit}
          disabled={isLoading || (paymentMethod === 'Transferencia' && !receipt) || deliveryCost === null || deliveryCost === 0}
        >
          Confirmar Pedido
        </Button>
        <Button
          variant="outlined"
          sx={{ borderColor: theme.palette.primary.main, color: theme.palette.primary.main, '&:hover': { borderColor: theme.palette.custom.hoover, color: theme.palette.custom.hoover }, borderRadius: '16px', mt: 1 }}
          onClick={handleContinueShopping}
        >
          Sigue Comprando
        </Button>
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Dialog for autofill confirmation */}
      <AutofillDialog
        open={openDialog}
        onClose={handleDialogClose}
        onConfirm={handleDialogClose}
        userName={fetchedOrder?.nombre_completo}
      />
    </Paper>
  );
};

export default CheckoutPage;
