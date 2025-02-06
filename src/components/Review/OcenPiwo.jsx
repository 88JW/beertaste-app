
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Paper, Typography, Box, Button } from "@mui/material";
import IlePiwWypito from "./IlePiwWypito";

const OcenPiwo = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/");

  return (
    <>
    <h1>Twoja Piwna Historia:</h1>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",         
          alignItems: "center",   
        }}
      >
        <Box className='boxContainer'>
        <Link to="/add-review" >
          <div className="tile">           
            Dodaj Ocenę
          </div>
        </Link>
        <Link to="/my-reviews" >
        <div className="tile">           
            Moje Oceny
          </div>
        </Link>
        </Box>
        <Paper elevation={3} sx={{ mt: 2 }}>
        <IlePiwWypito />
        </Paper>
      </Box>
      <Button sx={{ mt: 2 }} variant="contained" onClick={handleBack}>
        Wstecz
      </Button>
    </>
  );
};

export default OcenPiwo;