import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../firebase";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Login = ({ setIsLoggedIn, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

        if(user){
          setUser({
            displayName: user.displayName,
            email: user.email,
            uid: user.uid
          });
          setIsLoggedIn(true);
          navigate('/menu')
        } else {
          alert("Błąd logowania: Nie pobrano danych użytkownika.");
        }     
    } catch (error) {
      alert("Błąd logowania: " + error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <Link to="/register">Zarejestruj się</Link>
    </form>
  );
};

export default Login;
