import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from '@mui/material/Stack';
import btaLogo from '../../assets/bta_logo_2.png';

const Login = ({ setIsLoggedIn, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      if (user) {
        setUser({
          displayName: user.displayName,
          email: user.email,
          uid: user.uid,
        });
        setIsLoggedIn(true);
        navigate("/");
      } else {
        alert("Błąd logowania: Nie pobrano danych użytkownika.");
      }
    } catch (error) {
      alert("Błąd logowania: " + error.message);
    }
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <img src={btaLogo} alt="BTA Logo" style={{ display: 'block', margin: '0 auto', maxWidth: '250px' }} />
      <Typography variant="h2">Zaloguj się</Typography>
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          margin="normal"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          margin="normal"
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Stack direction="column" spacing={1} sx={{ mt: 1 }}>
          <Button type="submit" variant="contained" className="customButton">
            Login
          </Button>
          <Button component={Link} to="/register" className="customButton" >Zarejestruj się</Button>
          <Button component={Link} to="/password-reset" className="customButton">
            Zapomniałeś hasła?
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Login;
