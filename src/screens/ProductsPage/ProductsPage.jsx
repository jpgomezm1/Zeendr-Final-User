import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Grid, Card, CardMedia, CardContent, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import LazyLoad from 'react-lazyload';
import ProductModal from '../../components/ProductModal/ProductModal';
import Header from '../../components/Header/Header';
import CartSummary, { selectTotalItems } from '../../components/CartSummary/CartSummary';
import Footer from '../../components/Footer/Footer';
import OffersSection from './OffersSection';
import { useSelector } from 'react-redux';
import { useEstablecimiento } from '../../App';
import { useNavigate } from 'react-router-dom';
import Placeholder from '../../components/Placeholder/Placeholder';

const CategoryButton = styled(Button)(({ theme }) => ({
  color: theme.palette.custom.dark,
  borderColor: theme.palette.custom.dark,
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: '26px',
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
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const { establecimiento, logoUrl, bannerUrls } = useEstablecimiento();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  const totalItems = useSelector(selectTotalItems);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/productos/disponibles?establecimiento=${encodeURIComponent(establecimiento)}`)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [establecimiento]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/categorias/disponibles`)
      .then(response => {
        const orderedCategories = response.data.map(categoria => categoria.nombre);
        const categoriesWithProducts = orderedCategories.filter(category => 
          products.some(product => product.categoria === category)
        );
        setCategories(['Todos', ...categoriesWithProducts]);
      })
      .catch(error => console.error('Error fetching categories:', error));
  }, [products]);

  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBanner(prevBanner => (prevBanner + 1) % bannerUrls.length);
    }, 7000);

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

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => selectedCategory === 'Todos' || product.categoria === selectedCategory)
      .filter(product => product.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, selectedCategory, searchTerm]);

  const renderCategorySection = (category) => {
    const categoryProducts = filteredProducts.filter(product => category === 'Todos' || product.categoria === category);
    
    return (
      <Box key={category}>
        <Typography variant="h4" sx={{ mt: 4, mb: 2, color: theme.palette.custom.dark, fontWeight: 'bold' }}>
          {category}
        </Typography>
        <Grid container spacing={2}>
          {categoryProducts.map(product => (
            <Grid item xs={6} sm={4} md={3} lg={3} key={product.id} onClick={() => handleOpenModal(product)}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: { xs: 250, md: 300, lg: 350 }, position: 'relative', overflow: 'hidden', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', cursor: 'pointer' } }}>
                {product.descuento > 0 && (
                  <Box sx={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '10px', zIndex: 1 }}>
                    {product.descuento}% OFF
                  </Box>
                )}
                <LazyLoad height={300} offset={100} placeholder={<Placeholder />}>
                  <CardMedia 
                    component="img" 
                    image={product.imagen_url} 
                    alt={product.nombre} 
                    sx={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </LazyLoad>
                <CardContent sx={{ mt: 'auto', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: 2, position: 'absolute', bottom: 0 }}>
                  <Typography variant="h6" component="div">
                    {product.nombre}
                  </Typography>
                  {product.descuento > 0 ? (
                    <>
                      <Typography variant="body1" sx={{ textDecoration: 'line-through' }}>
                        {formatCurrency(product.precio)}
                      </Typography>
                      <Typography variant="body1">
                        {formatCurrency(product.precio * (1 - product.descuento / 100))}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body1">
                      {formatCurrency(product.precio)}
                    </Typography>
                  )}
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
    <Box sx={{ pt: isLargeScreen ? '120px' : '0', p: 2, pb: totalItems > 0 ? (isLargeScreen ? '170px' : '130px') : 2, maxWidth: { xs: '100%', md: '80%' }, mx: 'auto' }}>
      <Header logo={logoUrl} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Box sx={{ my: 2 }}>
        <img src={bannerUrls[currentBanner]} alt="Special Offer" style={{ width: '100%', borderRadius: '10px' }} />
      </Box>
      <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', mb: 1 }}>
        {categories.map((category, index) => (
          <CategoryButton key={index} variant="outlined" sx={{ backgroundColor: theme.palette.primary.main, fontWeight: 'bold', color: theme.palette.custom.light, display: 'inline-block', marginRight: isLargeScreen ? '16px' : '8px', fontSize: isLargeScreen ? '1.25rem' : '1rem', padding: isLargeScreen ? '10px 20px' : '6px 12px' }} onClick={() => handleCategoryClick(category)}>
            {category}
          </CategoryButton >
        ))}
      </Box>
      <OffersSection products={products} handleOpenModal={handleOpenModal} />
      {selectedCategory === 'Todos' ? categories.filter(c => c !== 'Todos').map(renderCategorySection) : renderCategorySection(selectedCategory)}
      {selectedProduct && (
        <ProductModal product={selectedProduct} open={openModal} onClose={handleCloseModal} />
      )}
      {totalItems > 0 && <CartSummary onViewCart={handleViewCart} />}
      {totalItems === 0 && <Footer />}
    </Box>
  );
}

export default ProductsPage;
