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
    <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap:2 }}>
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
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
        <Button component={Link} to="/register" color="primary" >Zarejestruj się</Button>
      </Box>
    </Container>
  );
};

export default Login;
