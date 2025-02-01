import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginRight: theme.spacing(1),
}));

const BLGCalculator = () => {
  const [sg, setSg] = useState("");
  const [blg, setBlg] = useState("");
  const [plato, setPlato] = useState("");
  const navigate = useNavigate();

  const handleSgChange = (event) => {
    const value = event.target.value;
    setSg(value);
    if (value) {
      const parsedSg = parseFloat(value);
      if (!isNaN(parsedSg)) {
        const calculatedBlg =
          (182.4601 * parsedSg - 775.6821) * parsedSg + 126.7794;
        setBlg(calculatedBlg.toFixed(2));
        setPlato(
          ((135.997 * parsedSg - 630.272) * parsedSg + 111.114).toFixed(2)
        );
      } else {
        setBlg("");
        setPlato("");
      }
    } else {
      setBlg("");
      setPlato("");
    }
  };

  const handleBlgChange = (event) => {
    const value = event.target.value;
    setBlg(value);
    if (value) {
      const parsedBlg = parseFloat(value);
      if (!isNaN(parsedBlg)) {
        const calculatedSg =
          0.00000158 * parsedBlg * parsedBlg + 0.0038594 * parsedBlg + 1;
        setSg(calculatedSg.toFixed(3));
        setPlato(
          ((135.997 * calculatedSg - 630.272) * calculatedSg + 111.114).toFixed(
            2
          )
        );
      } else {
        setSg("");
        setPlato("");
      }
    } else {
      setSg("");
      setPlato("");
    }
  };

  return (
    <div className="app-container">
      <h1>Kalkulator blg/sg</h1>

      <StyledTextField
        label="Stopnie Ballinga (°Blg)"
        type="number"
        value={blg}
        onChange={handleBlgChange}
      />
      <StyledTextField
        label="Gęstość brzeczki (SG)"
        type="number"
        value={sg}
        onChange={handleSgChange}
      />
      <StyledButton
        variant="outlined"
        startIcon={<ArrowBackIosNewIcon />}
        onClick={() => navigate("/kalkulatory")}
      >
        Wstecz
      </StyledButton>
    </div>
  );
};

export default BLGCalculator;
