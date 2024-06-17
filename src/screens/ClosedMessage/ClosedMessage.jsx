import React from 'react';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useEstablecimiento } from '../../App'; // Importa el contexto

const ClosedMessageContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: '#f4f1ea',
  textAlign: 'center',
  padding: '40px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const StyledTypography = styled(Typography)({
  color: '#444',
  marginBottom: '16px',
  fontFamily: 'Poppins, Arial, sans-serif',
});

const ClosedMessage = ({ horarios }) => {
  const { logoUrl } = useEstablecimiento(); // Obtén la URL del logo del contexto

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const hourInt = parseInt(hour, 10);
    const isPM = hourInt >= 12;
    const formattedHour = hourInt % 12 || 12;
    const formattedTime = `${formattedHour}:${minute} ${isPM ? 'PM' : 'AM'}`;
    return formattedTime;
  };

  const diasOrden = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

  const horariosOrdenados = horarios.sort((a, b) => {
    return diasOrden.indexOf(a.dia.toLowerCase()) - diasOrden.indexOf(b.dia.toLowerCase());
  });

  return (
    <ClosedMessageContainer>
      <img src={logoUrl} alt="Establecimiento Logo" style={{ width: '180px', marginBottom: '30px' }} />
      <StyledTypography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Estamos cerrados
      </StyledTypography>
      <StyledTypography variant="body1" sx={{ marginBottom: '24px' }}>
        Lo sentimos, pero actualmente no estamos tomando pedidos. Por favor, vuelve más tarde.
      </StyledTypography>
      <StyledTypography variant="body1" sx={{ marginBottom: '8px' }}>
        Gracias por visitar nuestra tienda.
      </StyledTypography>
      <StyledTypography variant="body1" sx={{ marginBottom: '24px' }}>
        Nuestros horarios de atención para domicilios son:
      </StyledTypography>
      <Box>
        {horariosOrdenados.map((horario) => (
          <StyledTypography key={horario.dia} variant="body2">
            {`${horario.dia.charAt(0).toUpperCase() + horario.dia.slice(1)}: ${formatTime(horario.apertura)} - ${formatTime(horario.cierre)}`}
          </StyledTypography>
        ))}
      </Box>
    </ClosedMessageContainer>
  );
};

ClosedMessage.propTypes = {
  horarios: PropTypes.arrayOf(
    PropTypes.shape({
      dia: PropTypes.string.isRequired,
      apertura: PropTypes.string.isRequired,
      cierre: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ClosedMessage;
