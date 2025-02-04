import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AssignmentIcon from "@mui/icons-material/Assignment";
import StarRateIcon from "@mui/icons-material/StarRate";
import CalculateIcon from "@mui/icons-material/Calculate";
import { useMediaQuery, useTheme } from '@mui/material';
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
  
function MenuPage({ handleLogout }) {
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
  };


  return (
    <Container maxWidth="md" className="containerMenu" >
      <h1>Witamy w Menu</h1>
      <Box className="boxContainer">
        <Link to="/dzienniki" style={{ textDecoration: 'none' }}>
          <div className="tile">
            <AssignmentIcon className="iconMenu" sx={{ fontSize: '5em', marginBottom:'10px' }}/>
            Dzienniki
          </div>
        </Link>
        <Link to="/ocenPiwo" style={{ textDecoration: 'none' }}>
          <div className="tile" >
            <StarRateIcon className="iconMenu" sx={{ fontSize: '5em', marginBottom:'10px' }}/>
            Oceń Piwo
          </div>
        </Link>
        <Link to="/kalkulatory" style={{ textDecoration: 'none' }}>
          <div className="tile" >
            <CalculateIcon className="iconMenu" sx={{ fontSize: '5em', marginBottom:'10px' }}/>
            Kalkulatory
         </div>
        </Link>
        <Link to="/receptury" style={{ textDecoration: 'none' }}>
          <div className="tile">
            <MenuBookIcon className="iconMenu" sx={{ fontSize: '5em', marginBottom:'10px' }}/>
            Receptury
          </div>
        </Link>
        <Link to="/pomysly" style={{ textDecoration: 'none' }}>
          <div className="tile">
            <LightbulbIcon className="iconMenu" sx={{ fontSize: '5em', marginBottom:'10px' }}/>
            Pomysły
          </div>
        </Link>
      </Box>

      <button className="logout-button" onClick={handleLogoutClick}>
        Wyloguj
      </button>

    </Container>
  );
}

export default MenuPage;

