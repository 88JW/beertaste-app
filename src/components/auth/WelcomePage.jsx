import React from 'react';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import btaLogo from '../../assets/bta_logo_2.png';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

function WelcomePage({ user }) {
  const handleTestLogin = async () => {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, 'w.jaskula8@gmail.com', 'zaq12wsx');
      console.log('Zalogowano na konto testowe');
    } catch (error) {
      console.error('Błąd logowania testowego:', error);
    }
  };

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
        <Button
          variant="contained"
          onClick={handleTestLogin}
          className="customButton"
          sx={{ bgcolor: 'secondary.main' }}
        >
          Zaloguj na konto testowe
        </Button>
      </Stack>
    </Container>
  );
}
export default WelcomePage;