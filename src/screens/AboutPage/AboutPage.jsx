import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import madrigueraLogo from '../../assets/conejo2.png'; // Asegúrate de que la ruta al logo sea correcta
import image1 from '../../assets/madriguera/image1.jpeg';
import image2 from '../../assets/madriguera/image2.jpeg';
import image3 from '../../assets/madriguera/image3.jpeg';
import image4 from '../../assets/madriguera/image4.jpeg';
import image5 from '../../assets/madriguera/image5.jpeg';
import image6 from '../../assets/madriguera/image6.jpeg';
import image7 from '../../assets/madriguera/image7.jpeg';

const images = [image1, image2, image3, image4, image5, image6, image7];

const AboutPage = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000); // Cambiar cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <img src={madrigueraLogo} alt="Madriguera Logo" style={{ width: 120, marginBottom: '2px', animation: 'bounce 2s infinite' }} />
        <Typography variant="h4" gutterBottom>
          Conoce Café Madriguera
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
          🌈✨ ¡Quiero compartir con ustedes uno de mis sueños de toda la vida! Mi propio café ¡Madriguera! 🎉 Después de varios meses de trabajo y esfuerzo junto a mi familia, hemos terminado este hermoso proyecto ubicado en la zona rosa de Laureles.
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
          En Madriguera Specialty Coffee puedes encontrar panadería y repostería de alta calidad, platos deliciosos diseñados por nosotros mismos perfectos para desayunar o almorzar, desde tostadas y waffles hasta granolas, paninis y por supuesto un delicioso café, también tenemos diferentes opciones para tardear 🍳🥐🍞 Todos nuestros platos están bajo el concepto de nombres de animales que viven en madrigueras.
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
          Este es tu nuevo espacio para inspirarte, trabajar, estudiar o simplemente compartir momentos inolvidables con amigos y familia. 💻💕👨‍👩‍👧‍👦
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
          Ven y siente la magia de Madriguera, donde cada detalle cuenta y cada visita te deja con ganas de volver. ¡Estamos super emocionados de empezar esta aventura, te esperamos para que nos conozcas! 🌟 🐇
        </Typography>
        <Paper sx={{ mt: 4, mb: 3, p: 3, backgroundColor: '#F0E8DD', borderRadius: '8px', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
            <LocationOnIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
            Visítanos en nuestro punto de venta:
          </Typography>
          <Typography variant="body1" sx={{ color: 'black' }}>
            Calle 5 sur #25-130, Medellín, El Poblado
          </Typography>
        </Paper>
        <Box sx={{ mt: 4 }}>
          <img src={images[currentImage]} alt="Galería Madriguera" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
        </Box>
      </Box>
    </Container>
  );
};

export default AboutPage;
