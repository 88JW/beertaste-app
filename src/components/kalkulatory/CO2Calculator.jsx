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
      <h1>Kalkulator Refermentacji</h1>

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

      <Button variant="contained" color="primary" onClick={oblicz} fullWidth sx={{ marginBottom: 2 }}>
        Oblicz
      </Button>
      
      {/* Results section */}
      {(wynikCukru || wynikButelek) && (
        <div>
          <h2>Wyniki kalkulacji refermentacji:</h2>
          {wynikCukru && (
            <p>
              Potrzebujesz <strong>{wynikCukru} gramów cukru</strong>. Rozpuść cukier w 300ml letniej
              wody.
            </p>
          )}
          {wynikButelek && (
            <p>Będzie potrzebne <strong>{wynikButelek} butelek</strong> (0.5L).</p>
          )}
          
          <div style={{ marginTop: '20px', padding: '15px', border: '1px dashed #ccc', borderRadius: '5px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Alternatywna metoda: Cukier bezpośrednio do butelek</h3>
            <p>
              Zamiast rozpuszczania całości cukru w wodzie, możesz dodać odmierzoną ilość 
              bezpośrednio do każdej butelki przed napełnieniem:
            </p>
            <ul style={{ marginBottom: '10px' }}>
              <li><strong>Małe nagazowanie:</strong> 3g cukru na butelkę 0.5L (~1/2 łyżeczki)</li>
              <li><strong>Standardowe nagazowanie:</strong> 4g cukru na butelkę 0.5L (~3/4 łyżeczki)</li>
              <li><strong>Duże nagazowanie:</strong> 5g cukru na butelkę 0.5L (~1 łyżeczka)</li>
            </ul>
            <p>
              <em>Uwaga: Stosując tę metodę, upewnij się, że dokładnie odmierzasz ilość cukru dla każdej butelki, 
              aby zapewnić jednakowy poziom nagazowania.</em>
            </p>
          </div>
          
          <p style={{ marginTop: '20px' }}>
            <strong>Wskazówka:</strong> Po dodaniu cukru i butelkowaniu, przechowuj butelki w temperaturze 
            18-22°C przez około 2 tygodnie w celu prawidłowej refermentacji.
          </p>
        </div>
      )}

      <div style={{ marginTop: '10px' }}>
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
}

export default Kalkulator;
