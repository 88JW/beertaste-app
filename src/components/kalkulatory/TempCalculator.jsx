import { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";


function Temperatury() {
  const [objetosc1, setObjetosc1] = useState("");
  const [temperatura1, setTemperatura1] = useState("");
  const [temperatura2, setTemperatura2] = useState("");
  const [temperaturaMieszaniny, setTemperaturaMieszaniny] = useState("");
  const [objetosc2, setObjetosc2] = useState(null);
  const navigate = useNavigate();

  const obliczObjetosc2 = () => {
    const V1 = parseFloat(objetosc1);
    const T1 = parseFloat(temperatura1);
    const T2 = parseFloat(temperatura2);
    const T_mieszaniny = parseFloat(temperaturaMieszaniny);

    if (!isNaN(V1) && !isNaN(T1) && !isNaN(T2) && !isNaN(T_mieszaniny)) {
      // Sprawdzenie, czy mianownik jest różny od zera
      if (T2 - T_mieszaniny !== 0) {
        const V2 = (T_mieszaniny * V1 - V1 * T1) / (T2 - T_mieszaniny);
        setObjetosc2(V2);
      } else {
        // Obsługa przypadku, gdy mianownik jest równy zeru
        alert(
          "Nie można obliczyć objętości drugiej cieczy. Upewnij się, że temperatura drugiej cieczy jest różna od żądanej temperatury mieszaniny."
        );
      }
    } else {
      // Obsługa błędów, np. wyświetlenie komunikatu o nieprawidłowych danych
      alert("Wprowadź poprawne dane.");
    }
  };

  return (
    <div className="app-container">
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Oblicz objętość potrzebnej zimnej wody
          </Typography>
          <TextField
            label="Objętość brzeczki w kotle (l)"
            value={objetosc1}
            onChange={(e) => setObjetosc1(e.target.value)}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Temperatura brzeczki w kotle (°C)"
            value={temperatura1}
            onChange={(e) => setTemperatura1(e.target.value)}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Temperatura zimenj wody (°C)"
            value={temperatura2}
            onChange={(e) => setTemperatura2(e.target.value)}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Żądana temperatura warki (°C)"
            value={temperaturaMieszaniny}
            onChange={(e) => setTemperaturaMieszaniny(e.target.value)}
            type="number"
            fullWidth
            margin="normal"
          />

          <Button variant="contained" onClick={obliczObjetosc2}>
            Oblicz
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/GotoweTemperatury")}
          >
            {" "}
            {/* Dodaj przycisk Gotowce */}
            GotoweTemperatury
          </Button>
          {objetosc2 !== null && (
            <Typography variant="body1" mt={2}>
              Objętość cieczy 2: {objetosc2.toFixed(2)} l
            </Typography>
          )}
          <Typography variant="body1" mt={1}>
            Łączna objętość mieszaniny:{" "}
            {(parseFloat(objetosc1) + objetosc2).toFixed(2)} l
          </Typography>
        </Box>
      </Container>
      <div className="button-container">
        
        <Button
          variant="outlined"
          startIcon={<ArrowBackIosNewIcon />}
          onClick={() => navigate("/kalkulatory")}
          sx={{ mr: 2 }}
        >
          Wstecz
        </Button>
      </div>
    </div>
  );
}

export default Temperatury;
