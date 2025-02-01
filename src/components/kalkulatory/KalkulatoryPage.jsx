import React from 'react';
import { Link } from "react-router-dom";

function KalkulatoryPage() {
  return (
    <div>
        <p><Link to="/kalkulatory/blg">BLGCalculator.jsx</Link></p>
        <p><Link to="/kalkulatory/co2">CO2Calculator.jsx</Link></p>
        <p><Link to="/kalkulatory/ibu">IbuCalculator.jsx</Link></p>
        <p><Link to="/kalkulatory/temp">TempCalculator.jsx</Link></p>
    </div>
  );
}

export default KalkulatoryPage;

