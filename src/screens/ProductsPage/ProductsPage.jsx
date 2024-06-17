import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Typography, Button, Grid, Card, CardMedia, CardContent, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import ProductModal from '../../components/ProductModal/ProductModal';
import Header from '../../components/Header/Header';
import CartSummary, { selectTotalItems } from '../../components/CartSummary/CartSummary';
import Footer from '../../components/Footer/Footer'; // Importar el componente Footer
import { useSelector } from 'react-redux';
import { useEstablecimiento } from '../../App'; // Importa el contexto
import { useNavigate } from 'react-router-dom';

const CategoryButton = styled(Button)(({ theme }) => ({
  color: theme.palette.custom.dark,
  borderColor: theme.palette.custom.dark,
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: '20px',
  padding: '6px 12px',
  textTransform: 'none',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  maxWidth: '100%',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

function ProductsPage() {
  const theme = useTheme();
  const { establecimiento, logoUrl, bannerUrls } = useEstablecimiento(); // Obtén las URLs de los banners del contexto
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState(['Todos']);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  const totalItems = useSelector(selectTotalItems);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/productos/disponibles?establecimiento=${encodeURIComponent(establecimiento)}`)
      .then(response => {
        console.log('Productos recibidos:', response.data);
        setProducts(response.data);
        const uniqueCategories = new Set(response.data.map(product => product.categoria));
        setCategories(['Todos', ...uniqueCategories]);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [establecimiento]);

  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBanner(prevBanner => (prevBanner + 1) % bannerUrls.length);
    }, 7000); // Cambiar cada 10 segundos

    return () => clearInterval(bannerInterval);
  }, [bannerUrls.length]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const renderCategorySection = (category) => {
    const filteredProducts = products
      .filter(product => category === 'Todos' || product.categoria === category)
      .filter(product => product.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
      
    console.log('Productos filtrados:', filteredProducts);
    return (
      <Box key={category}>
        <Typography variant="h4" sx={{ mt: 4, mb: 2, color: theme.palette.primary.main, fontWeight: 'bold' }}>
          {category}
        </Typography>
        <Grid container spacing={2}>
          {filteredProducts.map(product => (
            <Grid item xs={6} sm={6} key={product.id} onClick={() => handleOpenModal(product)}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: 250, position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  image={product.imagen_url}
                  alt={product.nombre}
                  sx={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <CardContent sx={{ mt: 'auto', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: 2, position: 'absolute', bottom: 0 }}>
                  <Typography variant="h6" component="div">
                    {product.nombre}
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(product.precio)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const handleViewCart = () => {
    navigate(`/${establecimiento}/cart`);
  };

  return (
    <Box sx={{ p: 2, pb: totalItems > 0 ? 14 : 2 }}>
      <Header logo={logoUrl} />

      <TextField 
        fullWidth 
        label="Buscar productos" 
        variant="outlined" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        InputProps={{
          endAdornment: <SearchIcon />
        }}
      />
      <Box sx={{ my: 2 }}>
        <img src={bannerUrls[currentBanner]} alt="Special Offer" style={{ width: '100%', borderRadius: '10px' }} />
      </Box>
      <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', mb: 4 }}>
        {categories.map((category, index) => (
          <CategoryButton key={index} variant="outlined" sx={{ backgroundColor: theme.palette.primary.main, fontWeight: 'bold', color: theme.palette.custom.light, display: 'inline-block', marginRight: '8px'}} onClick={() => handleCategoryClick(category)}>
            {category}
          </CategoryButton >
        ))}
      </Box>
      {selectedCategory === 'Todos' ? categories.filter(c => c !== 'Todos').map(renderCategorySection) : renderCategorySection(selectedCategory)}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          open={openModal}
          onClose={handleCloseModal}
        />
      )}
      {totalItems > 0 && <CartSummary onViewCart={handleViewCart} />}
      {totalItems === 0 && <Footer />}  {/* Mostrar el componente Footer solo si no hay items en el carrito */}
    </Box>
  );
}

export default ProductsPage;
