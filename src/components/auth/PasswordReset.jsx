import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

const PasswordReset = () => {
  const [email, setEmail] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Link do resetowania hasła został wysłany!');
    } catch (error) {
      alert('Błąd: ' + error.message);
    }
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Typography variant="h5">Resetowanie hasła</Typography>
      <Box component="form" onSubmit={handleReset} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          type="email"
          placeholder="Podaj email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" variant="contained" className="customButton">
          Wyślij link resetujący
        </Button>
      </Box>
      <Button component={Link} to="/login" variant="contained" className="customButton">
        Powrót do logowania
      </Button>
    </Container>
  );
};

export default PasswordReset;
