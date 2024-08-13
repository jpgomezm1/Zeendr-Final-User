import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  Paper,
  Divider,
  CircularProgress,
  Backdrop,
  Select,
  MenuItem,
  InputLabel,
  useTheme,
  InputAdornment,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
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
  const [addressDetails, setAddressDetails] = useState('');
  const [previousAddress, setPreviousAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryCost, setDeliveryCost] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [calculatingCost, setCalculatingCost] = useState(false);
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [fetchedOrder, setFetchedOrder] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  const [accountNumber, setAccountNumber] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
      maximumFractionDigits: 0,
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

    if (scheduleOrder) {
      if (!deliveryDate) {
        valid = false;
        errors.deliveryDate = 'La fecha de entrega es requerida';
      }
      if (!deliveryTimeRange) {
        valid = false;
        errors.deliveryTimeRange = 'El rango de horas es requerido';
      }
    }

    setErrors(errors);
    return valid;
  };

  const validateDiscountCode = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/cupones_disponibles?establecimiento=${encodeURIComponent(
          establecimiento
        )}`
      );
      const cupones = response.data;
      const cupon = cupones.find((c) => c.nombre === discountCode);

      if (cupon) {
        setDiscount((totalPrice * cupon.descuento) / 100);
        setErrors((prevErrors) => ({ ...prevErrors, discountCode: null }));
      } else {
        setDiscount(0);
        setErrors((prevErrors) => ({
          ...prevErrors,
          discountCode: 'El cupón no es válido o está congelado',
        }));
      }
    } catch (error) {
      console.error('Error al validar el cupón:', error);
    }
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
    formData.append('detalles_direccion', addressDetails);
    formData.append('productos', JSON.stringify(cartItems));
    formData.append('metodo_pago', paymentMethod);
    formData.append('costo_domicilio', deliveryCost);
    if (scheduleOrder) {
      formData.append('fecha_entrega', deliveryDate);
      formData.append('rango_horas', deliveryTimeRange);
    }
    if (receipt) {
      formData.append('comprobante', receipt);
    }
    if (discountCode) {
      formData.append('codigo_descuento', discountCode);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/pedido?establecimiento=${encodeURIComponent(
          establecimiento
        )}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

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
    if (address !== previousAddress) {
      setCalculatingCost(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/domicilio-price-noauth?establecimiento=${encodeURIComponent(
            establecimiento
          )}`
        );
        setDeliveryCost(response.data.price);
        setPreviousAddress(address);
      } catch (error) {
        console.error('Error al obtener el costo del domicilio:', error);
      } finally {
        setCalculatingCost(false);
      }
    }
  };

  const handleContinueShopping = () => {
    navigate(`/${establecimiento}`);
  };

  const fetchOrderDetails = async (phone) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/pedido/buscar`,
        {
          params: { numero_telefono: phone },
        }
      );

      if (response.status === 200) {
        const pedido = response.data;
        setFetchedOrder(pedido);
        setOpenDialog(true);
      } else {
        console.log('No se encontraron pedidos para este número de teléfono');
      }
    } catch (error) {
      console.error('Error al buscar pedidos:', error);
    }
  };

  const handleDialogClose = async (autofill) => {
    setOpenDialog(false);
    if (autofill && fetchedOrder) {
      setName(fetchedOrder.nombre_completo);
      setEmail(fetchedOrder.correo_electronico);
      setAddress(fetchedOrder.direccion);
      setPaymentMethod(fetchedOrder.metodo_pago);
    }
  };

  useEffect(() => {
    if (phone && phone.length === 10) {
      fetchOrderDetails(phone);
    }
  }, [phone]);

  const handlePlaceSelected = (place) => {
    setAddress(place.formatted_address);
  };

  useEffect(() => {
    const fetchEstablecimientoInfo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/logo?establecimiento=${encodeURIComponent(
            establecimiento
          )}`
        );
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

  const [scheduleOrder, setScheduleOrder] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTimeRange, setDeliveryTimeRange] = useState('');
  const [timeRanges] = useState([
    '10:00 - 12:00',
    '12:00 - 14:00',
    '14:00 - 16:00',
    '16:00 - 18:00',
  ]);

  return (
    <Paper
      elevation={0}
      sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4, borderRadius: 2 }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Información del Pedido
      </Typography>
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
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
            onPlaceChanged={() =>
              handlePlaceSelected(autocomplete.getPlace())
            }
          >
            <div style={{ position: 'relative', width: '100%' }}>
              <TextField
                label="Dirección"
                variant="outlined"
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onBlur={handleCalculateDeliveryCost}
                error={!!errors.address}
                helperText={errors.address}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {calculatingCost && <CircularProgress size={20} />}
                      {deliveryCost && !calculatingCost && <CheckCircle color="success" />}
                    </InputAdornment>
                  ),
                }}
                sx={{ width: '100%' }}
              />
            </div>
          </Autocomplete>
        )}
        <TextField
          label="Detalles de la Dirección"
          variant="outlined"
          fullWidth
          value={addressDetails}
          onChange={(e) => setAddressDetails(e.target.value)}
          sx={{ mt: 2 }}
        />
        {errors.deliveryCost && (
          <Typography variant="body2" color="error">
            {errors.deliveryCost}
          </Typography>
        )}
        <FormControl variant="outlined" error={!!errors.paymentMethod}>
          <InputLabel>Método de Pago</InputLabel>
          <Select
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            label="Método de Pago"
          >
            <MenuItem value="Transferencia">Transferencia</MenuItem>
          </Select>
          {errors.paymentMethod && (
            <Typography variant="body2" color="error">
              {errors.paymentMethod}
            </Typography>
          )}
        </FormControl>
        {paymentMethod === 'Transferencia' && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Realiza tu pago escaneando el código QR
            </Typography>
            <img
              src={qrCodeUrl}
              alt="QR Code"
              style={{ width: 200, height: 200 }}
            />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Total a pagar: {formatCurrency(totalPrice + deliveryCost - discount)}
            </Typography>
            <Typography variant="body1">
              Número de cuenta: {accountNumber}
            </Typography>
            <Button variant="contained" component="label" sx={{ mt: 2 }}>
              Cargar Comprobante
              <input type="file" hidden onChange={handleReceiptUpload} />
            </Button>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {receipt ? receipt.name : 'Por favor, carga el comprobante de pago'}
            </Typography>
          </Box>
        )}
        <TextField
          label="Cupón de Descuento"
          variant="outlined"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          error={!!errors.discountCode}
          helperText={errors.discountCode}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button onClick={validateDiscountCode}>Validar</Button>
              </InputAdornment>
            ),
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={scheduleOrder}
              onChange={(e) => setScheduleOrder(e.target.checked)}
              color="primary"
            />
          }
          label="Deseo programar mi pedido"
        />
        {scheduleOrder && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Fecha de Entrega"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              error={!!errors.deliveryDate}
              helperText={errors.deliveryDate}
            />
            <FormControl variant="outlined" error={!!errors.deliveryTimeRange}>
              <InputLabel>Rango de Horas</InputLabel>
              <Select
                value={deliveryTimeRange}
                onChange={(e) => setDeliveryTimeRange(e.target.value)}
                label="Rango de Horas"
              >
                {timeRanges.map((range) => (
                  <MenuItem key={range} value={range}>
                    {range}
                  </MenuItem>
                ))}
              </Select>
              {errors.deliveryTimeRange && (
                <Typography variant="body2" color="error">
                  {errors.deliveryTimeRange}
                </Typography>
              )}
            </FormControl>
          </Box>
        )}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Resumen del Pedido
        </Typography>
        <Box sx={{ mb: 2 }}>
          {cartItems.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="body1">
                {item.quantity} x {item.name}
              </Typography>
              <Typography variant="body1">
                {formatCurrency(item.price * item.quantity)}
              </Typography>
            </Box>
          ))}
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="body1">Domicilio</Typography>
            <Typography variant="body1">{formatCurrency(deliveryCost)}</Typography>
          </Box>
          {discount > 0 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="body1">Cupon</Typography>
              <Typography variant="body1">-{formatCurrency(discount)}</Typography>
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}
            >
              Total
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}
            >
              {formatCurrency(totalPrice + deliveryCost - discount)}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          sx={{
            backgroundColor: theme.palette.primary.main,
            '&:hover': { backgroundColor: theme.palette.custom.hoover },
            color: theme.palette.custom.light,
            borderRadius: '16px',
            mt: 2,
          }}
          onClick={handleSubmit}
          disabled={
            isLoading ||
            (paymentMethod === 'Transferencia' && !receipt) ||
            deliveryCost === null ||
            deliveryCost === 0
          }
        >
          Confirmar Pedido
        </Button>
        <Button
          variant="outlined"
          sx={{
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              borderColor: theme.palette.custom.hoover,
              color: theme.palette.custom.hoover,
            },
            borderRadius: '16px',
            mt: 1,
          }}
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
