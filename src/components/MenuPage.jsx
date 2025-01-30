import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from '@mui/material/Button';
  
function MenuPage({ handleLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();

    navigate("/");
  };

  return (
    <div>
      <h1>
        AHAHAHAHAH ty ochlajmordo piwa ci się zachciało....
      </h1>
  
      <br></br>
      <button onClick={handleLogoutClick}>Wyloguj</button>
  
      <br></br>
  
      <Button variant="contained" component={Link} to="/add-review">Dodaj nową ocenę</Button>

    </div>
  );
}

export default MenuPage;