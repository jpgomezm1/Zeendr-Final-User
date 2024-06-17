import axios from 'axios';

const fetchBarrios = async () => {
  try {
    const response = await axios.get('https://domicilios-madriguera-ac104c9fedbe.herokuapp.com/barrios');  // Cambia esta URL a la correcta
    const barriosData = response.data.reduce((acc, barrio) => {
      acc[barrio.nombre] = barrio.costo;
      return acc;
    }, {});
    return barriosData;
  } catch (error) {
    console.error('Error fetching barrios:', error);
    return {};
  }
};

const deliveryCosts = await fetchBarrios();

export default deliveryCosts;

