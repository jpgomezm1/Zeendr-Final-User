import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';
import { useEstablecimiento } from '../../App';

const FailurePage = () => {
    const navigate = useNavigate();
    const { logoUrl } = useEstablecimiento();

    const handleRetry = () => {
        navigate('/checkout');
    };

    return (
        <Container sx={{ textAlign: 'center', pt: 4, bgcolor: '#FFF3F3', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ mb: 4 }}>
                <img src={logoUrl} alt="Lucca Logo" style={{ width: 120, marginBottom: 20 }} />
            </Box>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#FF5555', fontSize: '2.5rem' }}>
                Pago Fallido
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#333', fontSize: '1.4rem' }}>
                Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleRetry} 
                sx={{ 
                    backgroundColor: '#FF5555', 
                    color: '#fff', 
                    fontWeight: 'bold',
                    borderRadius: '25px',
                    padding: '12px 24px',
                    '&:hover': {
                        backgroundColor: '#e54b4b'
                    },
                    transition: 'all 0.3s ease',
                    '&:active': {
                        transform: 'scale(0.98)',
                    }
                }}>
                Intentar de Nuevo
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 2, color: '#888', cursor: 'pointer' }}>
                ¿Problemas recurrentes? <a href="/contact" style={{ color: '#FF5555' }}>Contacta soporte</a>
            </Typography>
        </Container>
    );
};

export default FailurePage;
