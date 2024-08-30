import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';
import { useEstablecimiento } from '../../App';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const { logoUrl } = useEstablecimiento();

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <Container sx={{ textAlign: 'center', pt: 4, bgcolor: '#F6F6F6', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ mb: 4 }}>
                <img src={logoUrl} alt="Lucca Logo" style={{ width: 120, marginBottom: 20 }} />
            </Box>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#5E55FF', fontSize: '2.5rem' }}>
                ¡Pago Exitoso!
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#333', fontSize: '1.4rem' }}>
                Tu pago se ha procesado correctamente. ¡Gracias por tu compra!
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleGoBack} 
                sx={{ 
                    backgroundColor: '#5E55FF', 
                    color: '#fff', 
                    fontWeight: 'bold',
                    borderRadius: '25px',
                    padding: '12px 24px',
                    '&:hover': {
                        backgroundColor: '#4b48e5'
                    },
                    transition: 'all 0.3s ease',
                    '&:active': {
                        transform: 'scale(0.98)',
                    }
                }}>
                Volver al Inicio
            </Button>
        </Container>
    );
};

export default PaymentSuccess;
