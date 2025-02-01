import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

// IBU = ( (Masa chmielu [g] * Alfa-kwasy [%] * Wykorzystanie [%]) / Objętość brzeczki [l] ) * 10

function Kalkulator() {
  const navigate = useNavigate();
  const [litryPiwa, setLitryPiwa] = useState("");
  const [gazowanie, setGazowanie] = useState("standardowo");
  const [wynikCukru, setWynikCukru] = useState(null);
  const [wynikButelek, setWynikButelek] = useState(null);

  const oblicz = () => {
    const litry = parseFloat(litryPiwa);
    if (isNaN(litry) || litry <= 0) {
      alert("Podaj poprawną liczbę litrów piwa.");
      return;
    }

    let gramyCukruNaButelke;
    switch (gazowanie) {
      case "mało":
        gramyCukruNaButelke = 3;
        break;
      case "dużo":
        gramyCukruNaButelke = 5;
        break;
      default:
        gramyCukruNaButelke = 4;
    }

    const iloscButelek = litry * 2;
    const calkowitaIloscCukru = iloscButelek * gramyCukruNaButelke;

    setWynikCukru(calkowitaIloscCukru);
    setWynikButelek(iloscButelek);
  };

  return (
    <div className="app-container">
      <h1>Kalkulator Refrmentaci</h1>

      <TextField
        label="Litry piwa"
        type="number"
        value={litryPiwa}
        onChange={(e) => setLitryPiwa(e.target.value)}
        fullWidth 
        sx={{ marginBottom: 2 }} 
      />

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="gazowanie-label">Gazowanie</InputLabel>
        <Select
          labelId="gazowanie-label"
          id="gazowanie"
          value={gazowanie}
          label="Gazowanie"
          onChange={(e) => setGazowanie(e.target.value)}
        >
          <MenuItem value="mało">Mało</MenuItem>
          <MenuItem value="standardowo">Standardowo</MenuItem>
          <MenuItem value="dużo">Dużo</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" onClick={oblicz} fullWidth>
        Oblicz
      </Button>
      {/* Elementy wyświetlające wyniki */}
      {wynikCukru && (
        <p>
          Potrzebujesz {wynikCukru} gramów cukru. Rozpuść cukier w 300ml letniej
          wody.
        </p>
      )}
      {wynikButelek && <p>Będzie potrzebne {wynikButelek} butelek.</p>}

      
      <Button
        variant="outlined"
        startIcon={<ArrowBackIosNewIcon />}
        onClick={() => navigate("/kalkulatory")}
      >
        Wstecz
      </Button>
    </div>
  );
}

export default Kalkulator;
