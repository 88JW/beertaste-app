import React from 'react';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import btaLogo from '../../assets/bta_logo.png';

function WelcomePage({ user }) {
  return (
    <Container>
      {/* <Typography variant="h4" align="center" gutterBottom>Witaj!</Typography> */}
      <img src={btaLogo} alt="BTA Logo" style={{ display: 'block', margin: '0 auto', maxWidth: '250px' }} />
      {user ? (
        <Typography align="center">Jesteś zalogowany jako: {user.email}</Typography>
      ) : null}
      <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          sx={{
            backgroundColor: '#959B27',
            border: '2px solid black',
            '&:hover': { backgroundColor: '#FFCF54' } // dodano hover kolor
          }}
        >
          Zaloguj się
        </Button>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          sx={{
            backgroundColor: '#959B27',
            border: '2px solid black',
            '&:hover': { backgroundColor: '#FFCF54' } // dodano hover kolor
          }}
        >
          Zarejestruj
        </Button>
      </Stack>
    </Container>
  );
}
export default WelcomePage;