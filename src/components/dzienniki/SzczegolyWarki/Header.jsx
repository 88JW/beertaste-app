import React from 'react';
import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = ({ isMobile }) => (
  <div className="no-print">
    <Typography variant="h5" component="h1" sx={{ 
      mb: { xs: 1, sm: 2 }, 
      mt: { xs: 0.5, sm: 1 },
      fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
    }}>
      Szczegóły Warki
    </Typography>
    <Button 
      component={Link} 
      to="/dzienniki/warzenia" 
      variant="contained" 
      color="primary" 
      sx={{ mt: { xs: 0.5, sm: 2 } }} 
      className="no-print"
      size={isMobile ? "small" : "medium"}
      fullWidth={isMobile}
    >
      Powrót do warzenia
    </Button>
  </div>
);

export default Header;
