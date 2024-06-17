import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, useTheme } from '@mui/material';

const AutofillDialog = ({ open, onClose, onConfirm, userName }) => {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, textAlign: 'center', borderBottom: `1px solid ${theme.palette.divider}` }}>
        ¡Bienvenido de vuelta, {userName}!
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', padding: theme.spacing(2) }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Se encontraron datos anteriores para este número de teléfono. ¿Desea autocompletar la información con los datos anteriores?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', paddingBottom: theme.spacing(2) }}>
        <Button onClick={() => onClose(false)} sx={{ color: theme.palette.error.main }}>
          No
        </Button>
        <Button onClick={() => onConfirm(true)} sx={{ color: theme.palette.success.main }}>
          Sí
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AutofillDialog;

