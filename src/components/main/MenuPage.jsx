import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import AssignmentIcon from "@mui/icons-material/Assignment";
import StarRateIcon from "@mui/icons-material/StarRate";
import CalculateIcon from "@mui/icons-material/Calculate";
import { useMediaQuery, useTheme } from '@mui/material';
import MenuBookIcon from "@mui/icons-material/MenuBook";

import "./MenuPage.css";
function MenuPage({ handleLogout }) {
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    handleLogout();

    navigate("/");
  };
  const theme = useTheme();
      const containerStyle = {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'};
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const boxContainerStyle = {
    display: 'flex',
    flexDirection: isSmallScreen ? 'column' : 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
    width: '100%', // Dodano szerokość 100%
    alignItems: 'center' //Dodane wycentrowanie w pionie
  };

  const tileBoxStyle = {
    width: isSmallScreen ? '100%' : 'calc(50% - 10px)',
    display: 'flex', // Dodane, aby wyśrodkować treść w kaflu
    justifyContent: 'center', // Dodane, aby wyśrodkować treść w kaflu
  };

  

  return (
    <Container maxWidth="md" sx={{...containerStyle, marginTop: 4 }}>
      <h1>Witamy w Menu</h1>
      <Box sx={boxContainerStyle}>
        <Box sx={tileBoxStyle}>
          <Link to="/dzienniki" style={{textDecoration: 'none'}}>
            <div className="tile" style={{flexDirection: 'column', display: 'flex', alignItems: 'center'}}>
              <AssignmentIcon sx={{ fontSize: '3em', marginBottom:'10px' }}/>
              Dzienniki
            </div>
          </Link>
        </Box>
        <Box sx={tileBoxStyle}>
          <Link to="/ocenPiwo" style={{textDecoration: 'none'}}>
            <div className="tile" style={{flexDirection: 'column', display: 'flex', alignItems: 'center'}}>
              <StarRateIcon sx={{ fontSize: '3em', marginBottom:'10px' }}/>
              Oceń Piwo
            </div>
          </Link>
        </Box>
        <Box sx={tileBoxStyle}>
                        <Link to="/kalkulatory" style={{textDecoration: 'none'}}>
                            <div className="tile" style={{flexDirection: 'column', display: 'flex', alignItems: 'center'}}>
                                <CalculateIcon sx={{ fontSize: '3em', marginBottom:'10px' }}/>
                                Kalkulatory
                            </div>
                        </Link>
                    </Box>
        <Box sx={tileBoxStyle}>
                        <Link to="/receptury" style={{textDecoration: 'none'}}>
                            <div className="tile" style={{flexDirection: 'column', display: 'flex', alignItems: 'center'}}>
                                <MenuBookIcon sx={{ fontSize: '3em', marginBottom:'10px' }}/>
                                Receptury
                            </div>
                        </Link>
        </Box>        
      </Box>
      <button className="logout-button" onClick={handleLogoutClick}>
        Wyloguj
      </button>

    </Container>
  );
}

export default MenuPage;

