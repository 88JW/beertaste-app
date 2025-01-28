import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Dodano import
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Routes> {/* Dodano Routes */}
      <Route path="/" element={<Login />} /> {/* Dodano Route */}
      <Route path="/register" element={<Register />} /> {/* Dodano Route */}
    </Routes>
  );
}

export default App;