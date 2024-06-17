import React from 'react';
import { Grid } from '@mui/material';

function Header({ logo }) {
  return (
    <Grid item xs={12} style={{ textAlign: 'center' }}>
      <img src={logo} alt="Logo de Cafe Madriguera" style={{ maxWidth: '150px', my: '10px' }} />
    </Grid>
  );
}

export default Header;
