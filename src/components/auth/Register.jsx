
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Opcjonalne

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Hasła nie są identyczne!");
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", user.uid), {
            beerDrank: 0,
        });
      alert("Zarejestrowano pomyślnie!");
      // Tutaj możesz przekierować użytkownika do innej strony po rejestracji
    } catch (error) {
         if (error.code === "auth/email-already-in-use"){
            alert("Taki email jest już zajęty!");
         }
      alert("Błąd rejestracji: " + error.message);
    }
  };
  
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap:1 }}>
         <Typography variant="h2" className="login-header">Zarejestruj się</Typography>
      <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column'}}>
        <TextField
          fullWidth
          margin="normal"
          type="email"
          placeholder="Email"
          value={email}
          sx={{marginTop:1}}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          type="password"
           sx={{marginTop:1}}
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          fullWidth
           sx={{marginTop:1}}
          margin="normal"
          type="password"
          placeholder="Potwierdź hasło"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">Zarejestruj się</Button>
      </Box>
      <Button component={Link} to="/" color="primary">Zaloguj się</Button>
    </Container>
  );
};

export default Register;
