import React from "react";
import { useNavigate } from "react-router-dom";

function MenuPage({ handleLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
  };
  return (
    <div>
      AHAHAHAHAH ty ochlajmordo piwa ci się zachciało.... 
      <br></br>
      <button onClick={handleLogoutClick}>Wyloguj</button>
    </div>
  );
}

export default MenuPage;