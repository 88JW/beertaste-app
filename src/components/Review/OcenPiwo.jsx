
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Paper, Typography, Box, Button } from "@mui/material";
import IlePiwWypito from "./IlePiwWypito";

const OcenPiwo = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/");

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
          p: 2,
        }}
      >
        <Link to="/add-review" style={{ textDecoration: "none" }}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center", width: "100%", maxWidth: "400px" }}>
            <Typography variant="h6">Dodaj Recenzję</Typography>
          </Paper>
        </Link>
        <Link to="/my-reviews" style={{ textDecoration: "none" }}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center", width: "100%", maxWidth: "400px" }}>
            <Typography variant="h6">Moje Recenzje</Typography>
          </Paper>
        </Link>
        <IlePiwWypito />
      </Box>
      <Button variant="contained" onClick={handleBack}>
        Wstecz
      </Button>
    </>
  );
};

export default OcenPiwo;