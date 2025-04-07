import React from "react";
import {  useNavigate } from "react-router-dom";
import {  Button } from "@mui/material";

function RecepturyPage() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/");
  };
  return (
    <>
    
      
      

    
    <Button variant="contained" onClick={handleBack}>Wstecz</Button>
    </>
  );
};

export default RecepturyPage;