
import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Typography, Box } from '@mui/material';

const OcenPiwo = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'center',
        p: 2,
      }}
    >
      
        <Link to="/add-review" style={{ textDecoration: 'none' }}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', width: '100%', maxWidth:'400px' }}>
            <Typography variant="h6">Dodaj Recenzję</Typography>
          </Paper>
        </Link>
      
        <Link to="/my-reviews" style={{ textDecoration: 'none' }}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', width: '100%', maxWidth:'400px' }}>
            <Typography variant="h6">Moje Recenzje</Typography>
          </Paper>
        </Link>
    </Box>
  );
};

export default OcenPiwo;