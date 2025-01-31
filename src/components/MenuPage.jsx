import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import Box from '@mui/material/Box';
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
      
          <h1>
            AHAHAHAHAH ty ochlajmordo piwa ci się zachciało....
          </h1>
          <Button variant="contained" color="secondary" onClick={handleLogoutClick}>Wyloguj</Button>

          <Button variant="contained" color="secondary" component={Link} to="/add-review">Dodaj nową ocenę</Button>
          <Button variant="contained" color="secondary" component={Link} to="/my-reviews">Moje Oceny</Button>
        </Box>
    </Container>
  );
}

export default MenuPage;