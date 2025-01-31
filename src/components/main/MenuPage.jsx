import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import './MenuPage.css';
function MenuPage({ handleLogout }) {
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    handleLogout();

    navigate("/");
  };



  return (
    <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            marginTop: 4,
          }}
        >
          <h1>Witamy w Menu</h1>

          <div className="tiles-container">
            <Link to="/add-review" className="tile">
              <div className="tile-content">
                Dodaj nową ocenę
              </div>
            </Link>

            <Link to="/my-reviews" className="tile">
              <div className="tile-content">
                Moje Oceny
              </div>
            </Link>
          </div>

          <button className="logout-button" onClick={handleLogoutClick}>
            Wyloguj
          </button>
        </Box>
    </Container>
  );
}

export default MenuPage;

