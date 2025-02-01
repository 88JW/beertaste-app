import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { v4 as uuidv4 } from "uuid";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";



const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: "100%",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginRight: theme.spacing(1),
}));

const IBUCalculator = () => {
  const navigate = useNavigate();
  const [chmiele, setChmiele] = useState([
    { id: uuidv4(), masa: "", alfaKwasy: "", czasGotowania: "" },
  ]);
  const [litryPiwa, setLitryPiwa] = useState("");
  const [originalGravity, setOriginalGravity] = useState("");
  const [wynikIBU, setWynikIBU] = useState(null);

  const dodajChmiel = () => {
    setChmiele([
      ...chmiele,
      { id: uuidv4(), masa: "", alfaKwasy: "", czasGotowania: "" },
    ]);
  };

  const usunChmiel = (id) => {
    setChmiele(chmiele.filter((chmiel) => chmiel.id !== id));
  };

  const handleChmielChange = (id, event) => {
    const { name, value } = event.target;
    setChmiele(
      chmiele.map((chmiel) =>
        chmiel.id === id ? { ...chmiel, [name]: value } : chmiel
      )
    );
  };

   const obliczIBU = () => {
     const litry = parseFloat(litryPiwa);
     const og = parseFloat(originalGravity);

     if (isNaN(litry) || litry <= 0) {
       alert("Podaj poprawną liczbę litrów piwa.");
       return;
     }

     if (isNaN(og) || og <= 0) {
       alert("Podaj poprawną gęstość początkową brzeczki.");
       return;
     }

     let totalIbu = 0;

     chmiele.forEach((chmiel) => {
       const masa = parseFloat(chmiel.masa);
       const alfa = parseFloat(chmiel.alfaKwasy);
       const czasGotowania = parseFloat(chmiel.czasGotowania);

       if (isNaN(masa) || isNaN(alfa) || isNaN(czasGotowania)) {
         return;
       }

       // Obliczenie współczynnika wykorzystania Rager
       const gestoscBrzeczki = og;
       const wspolczynnikGestosci =
         1.65 * Math.pow(0.000125, gestoscBrzeczki - 1);
       const wspolczynnikCzasuGotowania =
         (1 - Math.exp(-0.04 * czasGotowania)) / 4.15;
       const utilization = wspolczynnikGestosci * wspolczynnikCzasuGotowania;

       if (utilization > 0) {
         const ibuChmielu = (masa * (alfa / 100) * utilization * 1000) / litry;
         totalIbu += ibuChmielu;
       }
     });

     setWynikIBU(totalIbu.toFixed(2));
   };
  return (
    
    <div className="app-container">
      <h1>Kalkulator ibu</h1>
      <StyledTextField
        label="Litry piwa"
        type="number"
        value={litryPiwa}
        onChange={(e) => setLitryPiwa(e.target.value)}
      />
      <StyledTextField
        label="Gęstość początkowa brzeczki (SG)"
        type="number"
        value={originalGravity}
        onChange={(e) => setOriginalGravity(e.target.value)}
      />
      {chmiele.map((chmiel, index) => (
        <div key={chmiel.id} style={{ marginBottom: "10px" }}>
          <Typography variant="h6">Chmiel {index + 1}</Typography>
          <StyledTextField
            label="Masa (g)"
            type="number"
            name="masa"
            value={chmiel.masa}
            onChange={(event) => handleChmielChange(chmiel.id, event)}
          />
          <StyledTextField
            label="Alfa kwasy (%)"
            type="number"
            name="alfaKwasy"
            value={chmiel.alfaKwasy}
            onChange={(event) => handleChmielChange(chmiel.id, event)}
          />
          <StyledTextField
            label="Czas gotowania (min)"
            type="number"
            name="czasGotowania"
            value={chmiel.czasGotowania}
            onChange={(event) => handleChmielChange(chmiel.id, event)}
          />
          <StyledButton
            variant="outlined"
            color="secondary"
            onClick={() => usunChmiel(chmiel.id)}
          >
            Usuń
          </StyledButton>
        </div>
      ))}
      <StyledButton variant="contained" color="primary" onClick={dodajChmiel}>
        Dodaj chmiel
      </StyledButton>
      <StyledButton variant="contained" color="primary" onClick={obliczIBU}>
        Oblicz IBU
      </StyledButton>
      {wynikIBU !== null && (
        <Typography variant="h5" style={{ marginTop: "20px" }}>
          Wynik IBU: {wynikIBU}
        </Typography>
      )}
      <div>
     <Button
        variant="outlined"
        startIcon={<ArrowBackIosNewIcon />}
        onClick={() => navigate("/kalkulatory")}
      >
        Wstecz
      </Button>
</div>
      
    </div>
  );
};

export default IBUCalculator;
