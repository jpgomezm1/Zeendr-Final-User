import React, { useEffect, useState, createContext, useContext, useCallback } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useParams, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ProductsPage from './screens/ProductsPage/ProductsPage';
import CartPage from './screens/CartPage/CartPage';
import CheckoutPage from './screens/CheckoutPage/CheckoutPage';
import SuccessPage from './screens/SuccessPage/SuccessPage';
import AboutPage from './screens/AboutPage/AboutPage';
import ClosedMessage from './screens/ClosedMessage/ClosedMessage';
import { Provider } from 'react-redux';
import store from './redux/store';
import Loader from './components/Loader/Loader';

const EstablecimientoContext = createContext();

export function useEstablecimiento() {
  return useContext(EstablecimientoContext);
}

function App() {
  const [theme, setTheme] = useState(createTheme({
    typography: {
      fontFamily: 'Poppins, Arial, sans-serif',
    },
    palette: {
      primary: {
        main: '#5E55FF', // color primario
      },
      secondary: {
        main: '#5E55FE', // color secundario
      },
      custom: {
        light: '#e2dac7', // color personalizado claro
        dark: '#333', // color personalizado oscuro
        hoover: '#9541f7',
      },
    },
  }));

  const updateTheme = useCallback((colors) => {
    setTheme(createTheme({
      typography: {
        fontFamily: 'Poppins, Arial, sans-serif',
      },
      palette: {
        primary: {
          main: colors.primary_color,
        },
        secondary: {
          main: colors.secondary_color,
        },
        custom: {
          light: colors.custom_light_color,
          dark: colors.custom_dark_color,
          hoover: colors.custom_hoover_color,
        },
      },
    }));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/:establecimiento/*" element={<MainRoutes updateTheme={updateTheme} />} />
          </Routes>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

function MainRoutes({ updateTheme }) {
  const { establecimiento } = useParams();
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrls, setBannerUrls] = useState([]);
  const [establecimientoName, setEstablecimientoName] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    const fetchLogoAndBanners = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/logo?establecimiento=${encodeURIComponent(establecimiento)}`);
        const data = response.data;
        setLogoUrl(data.logo_url);
        setBannerUrls([data.banner1_url, data.banner2_url, data.banner3_url]);
        const capitalizedEstablecimiento = capitalizeWords(data.establecimiento);
        setEstablecimientoName(capitalizedEstablecimiento);
        setInstagramUrl(data.instagram_url);
        setTiktokUrl(data.tiktok_url);
        setWhatsappUrl(data.whatsapp_url);

        // Update the theme with the new colors
        updateTheme({
          primary_color: data.primary_color,
          secondary_color: data.secondary_color,
          custom_light_color: data.custom_light_color,
          custom_dark_color: data.custom_dark_color,
          custom_hoover_color: data.custom_hoover_color,
        });

        // Update document title and meta tags
        document.title = `Domicilios ${capitalizedEstablecimiento}`;
        document.querySelector('meta[name="description"]').setAttribute('content', `Bienvenido a la linea de domicilios de ${capitalizedEstablecimiento}`);
      } catch (error) {
        console.error('Error fetching logo and banners:', error);
      } finally {
        setLoading(false);
      }
    };

    if (establecimiento) {
      fetchLogoAndBanners();
    } else {
      setLoading(false);
    }
  }, [establecimiento, updateTheme]);

  useEffect(() => {
    if (!establecimiento) {
      navigate('/'); // Redirigir a la página principal si no hay establecimiento
    }
  }, [establecimiento, navigate]);

  if (loading) {
    return <Loader />;
  }

  return (
    <EstablecimientoContext.Provider value={{ establecimiento, logoUrl, bannerUrls, establecimientoName, instagramUrl, tiktokUrl, whatsappUrl }}>
      <EstablecimientoWrapper />
    </EstablecimientoContext.Provider>
  );
}

function EstablecimientoWrapper() {
  const { establecimiento } = useEstablecimiento();
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [horarios, setHorarios] = useState([]);

  useEffect(() => {
    const fetchHorarios = async () => {
      if (!establecimiento) {
        console.log('No establecimiento found in URL.');
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/horarios_establecimiento?establecimiento=${encodeURIComponent(establecimiento)}`);
        console.log('Horarios fetched:', response.data);
        setHorarios(response.data);
      } catch (error) {
        console.error('Error fetching horarios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHorarios();
  }, [establecimiento]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkIfOpen = () => {
      const now = new Date();
      const currentDay = now.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();

      console.log("Current Day:", currentDay);
      console.log("Horarios:", horarios);
      const todayHorario = horarios.find(horario => horario.dia.toLowerCase() === currentDay);

      if (todayHorario) {
        console.log("Today's Horario:", todayHorario);
        const { apertura, cierre } = todayHorario;

        const [aperturaHoras, aperturaMinutos] = apertura.split(':').map(Number);
        const [cierreHoras, cierreMinutos] = cierre.split(':').map(Number);

        const aperturaDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), aperturaHoras, aperturaMinutos);
        const cierreDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), cierreHoras, cierreMinutos);
        const currentTimeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());

        console.log("Apertura:", aperturaDate);
        console.log("Cierre:", cierreDate);
        console.log("Current Time:", currentTimeDate);

        if (aperturaDate <= currentTimeDate && currentTimeDate <= cierreDate) {
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
      } else {
        console.log("No horario found for today.");
        setIsOpen(false);
      }
    };

    if (horarios.length > 0) {
      checkIfOpen();
    }
  }, [horarios]);

  if (loading) {
    return <Loader />;
  }

  if (!isOpen) {
    return <ClosedMessage horarios={horarios} />;
  }

  return (
    <Routes>
      <Route path="/" element={<ProductsPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="checkout" element={<CheckoutPage />} />
      <Route path="success" element={<SuccessPage />} />
      <Route path="about" element={<AboutPage />} />
    </Routes>
  );
}

export default App;


