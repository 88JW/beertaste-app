import React from 'react';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import btaLogo from '../../assets/bta_logo_2.png';

function WelcomePage({ user }) {
  return (
    <Container>
      <img src={btaLogo} alt="BTA Logo" style={{ display: 'block', margin: '0 auto', maxWidth: '250px' }} />
      {user ? (
        <Typography align="center">Jesteś zalogowany jako: {user.email}</Typography>
      ) : null}
      <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          className="customButton"
        >
          Zaloguj się
        </Button>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          className="customButton"
        >
          Zarejestruj
        </Button>
      </Stack>
    </Container>
  );
}
export default WelcomePage;