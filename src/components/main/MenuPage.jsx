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
import QuizIcon from '@mui/icons-material/Quiz'; // Dodana nowa ikona
import RssFeedIcon from '@mui/icons-material/RssFeed';
import Button from "@mui/material/Button";
import btaLogo from '../../assets/bta_logo_3.png';

function MenuPage({ handleLogout }) {
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
  };


  return (
    <Container maxWidth="md" className="containerMenu" >
      <img src={btaLogo} alt="BTA Logo" style={{ display: 'block', marginBottom:'30px', margin: '0 auto', maxWidth: '250px' }} />
      <Box className="boxContainer">
        <Link to="/dzienniki" style={{ textDecoration: 'none' }}>
          <div className="tile">
            <AssignmentIcon className="iconMenu" sx={{ fontSize: '5em', marginBottom: '10px' }} />
            Dzienniki
          </div>
        </Link>
        <Link to="/ocenPiwo" style={{ textDecoration: 'none' }}>
          <div className="tile" >
            <StarRateIcon className="iconMenu" sx={{ fontSize: '5em', marginBottom: '10px' }} />
            Oceń Piwo
          </div>
        </Link>
        <Link to="/kalkulatory" style={{ textDecoration: 'none' }}>
          <div className="tile" >
            <CalculateIcon className="iconMenu" sx={{ fontSize: '5em', marginBottom: '10px' }} />
            Kalkulatory
          </div>
        </Link>
        <Link to="/receptury" style={{ textDecoration: 'none' }}>
          <div className="tile">
            <MenuBookIcon className="iconMenu" sx={{ fontSize: '5em', marginBottom: '10px' }} />
            Receptury
          </div>
        </Link>
        <Link to="/pomysly" style={{ textDecoration: 'none' }}>
          <div className="tile">
            <LightbulbIcon className="iconMenu" sx={{ fontSize: '5em', marginBottom: '10px' }} />
            Pomysły
          </div>
        </Link>
        <Link to="/quiz" style={{ textDecoration: 'none' }}>
          <div className="tile">
            <QuizIcon className="iconMenu" sx={{ fontSize: '5em', marginBottom: '10px' }} />
            Quiz
          </div>
        </Link>
           <Link to="/posts" style={{ textDecoration: 'none' }}>
          <div className="tile">
            <RssFeedIcon className="iconMenu" sx={{ fontSize: '5em', marginBottom: '10px' }} />
            Piwne Posty
          </div>
        </Link>
      </Box>
      <Button sx={{ marginTop: '10px' }} variant="contained" className="customButton" onClick={handleLogoutClick}>
        Wyloguj
      </Button>


    </Container>
  );
}

export default MenuPage;

