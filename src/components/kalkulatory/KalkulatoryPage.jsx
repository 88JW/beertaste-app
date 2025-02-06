import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';

function KalkulatoryPage({handleLogout}) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/');
  };
  return (
    <>
    <h1>Piwne Kalkulatory:</h1>
    <Box className='boxContainer'>
          <Box className='tile'>
          <Link to="/kalkulatory/blg">
                <p className='iconMenu'> BLG Calculator</p>
            </Link>
          </Box>
          <Box className='tile'>
          <Link to="/kalkulatory/co2">
                <p className='iconMenu'> CO2 Calculator</p>
            </Link>
          </Box>
          <Box className='tile'>
          <Link to="/kalkulatory/ibu">
                <p className='iconMenu'> Ibu Calculator</p>
            </Link>
          </Box>
          <Box className='tile'>
          <Link to="/kalkulatory/temp">
                <p className='iconMenu'> Temp Calculator</p>
            </Link>
          </Box>
      </Box>
      <Button sx={{ mt: 2 }} variant="contained" onClick={handleClick}>Wstecz</Button>
    </>
  );
}

export default KalkulatoryPage;

