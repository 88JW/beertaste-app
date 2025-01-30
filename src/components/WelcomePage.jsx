import React from 'react';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function WelcomePage({ user }) {
  return (
    <Container
    >
      <Typography variant="h1" align="center" gutterBottom>Witaj!</Typography>
      {user ? (
        <Typography align="center">Jesteś zalogowany jako: {user.email}</Typography>
      ) : null}
      <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
        <Button component={Link} to="/login" color="primary" variant="contained" >Zaloguj się</Button>
        <Button component={Link} to="/register" color="primary" variant="contained" >Zarejestruj</Button>
      </Stack> 
    </Container>
  );
}

export default WelcomePage;
