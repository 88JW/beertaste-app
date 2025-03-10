import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import Bottle from '../../assets/bottle.png'; 
import Brew from '../../assets/brew.png';

function DziennikiPage() {
  console.log("DziennikiPage")
  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/');
  };
  return (
    <>
    <h1>Warzenie Piwa:</h1>
    <Box className='boxContainer'>
      <Box className="tile" onClick={() => navigate('/dzienniki/asystent-butelkowania')}>
        <img src={Bottle} alt='butelka' className='iconMenu'/>
        <Typography variant='h6' sx={{fontSize: '1.2rem'}}>
          Asystent Butelkowania
        </Typography>
      </Box>
      <Box className="tile" onClick={() => navigate('/dzienniki/asystent-warzenia')}>
         <img src={Brew} alt='brewing' className='iconMenu'/>
        <Typography variant='h6' sx={{fontSize: '1.2rem'}}>
          Asystent Warzenia
        </Typography>
      </Box>
       <Box className="tile" onClick={() => navigate('/dzienniki/warzenia')}>
         <img src={Brew} alt='brewing' className='iconMenu'/>
        <Typography variant='h6' sx={{fontSize: '1.2rem'}}>
         Dzienniki Warzenia
        </Typography>
      </Box>
    </Box>
    <Button variant="contained" sx={{ mt: 2 }} onClick={handleBack}>Wstecz</Button>
    </>
  );
}

export default DziennikiPage;