import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Snackbar, Alert } from '@mui/material';
import Bottle from '../../assets/bottle.png'; 
import Brew from '../../assets/brew.png';
import { auth } from '../../firebase';

function DziennikiPage() {
  console.log("DziennikiPage")
  const navigate = useNavigate();
  const [isTestUser, setIsTestUser] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      const user = auth.currentUser;
      if (user && user.uid === 'UPP0NzXUdafmXrFhyrCNlh1bxSG2') {
        setIsTestUser(true);
      } else {
        setIsTestUser(false);
      }
    };
    
    checkUser();
    const unsubscribe = auth.onAuthStateChanged(checkUser);
    return () => unsubscribe();
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  const handleDziennikiWarzeniaClick = () => {
    if (isTestUser) {
      setOpenSnackbar(true);
    } else {
      navigate('/dzienniki/warzenia');
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
        <Box 
          className="tile" 
          onClick={handleDziennikiWarzeniaClick}
          sx={isTestUser ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
        >
          <img src={Brew} alt='brewing' className='iconMenu'/>
          <Typography variant='h6' sx={{fontSize: '1.2rem'}}>
            Dzienniki Warzenia
          </Typography>
        </Box>
      </Box>
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleBack}>Wstecz</Button>
      
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
          Użytkownik testowy nie ma dostępu do Dzienników Warzenia!
        </Alert>
      </Snackbar>
    </>
  );
}

export default DziennikiPage;