import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/auth/Login';
import MenuPage from './components/main/MenuPage';
import Register from './components/auth/Register';
import WelcomePage from './components/auth/WelcomePage';
import MyReviewsPage from './components/Review/MyReviewsPage'
import ReviewDetailsPage from './components/Review/ReviewDetailsPage'
import { auth } from './firebase';
import AddReviewPage from './components/Review/AddReviewPage'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import DziennikiPage from './components/dzienniki/DziennikiPage';
import KalkulatoryPage from './components/kalkulatory/KalkulatoryPage';
import BLGCalculator from './components/kalkulatory/BLGCalculator';
import CO2Calculator from './components/kalkulatory/CO2Calculator';
import IbuCalculator from './components/kalkulatory/IbuCalculator';
import TempCalculator from './components/kalkulatory/TempCalculator';
import OcenPiwo from './components/Review/OcenPiwo';
import AsystentWarzenia from './components/dzienniki/AsystentWarzenia';
import AsystentButelkowania from './components/dzienniki/AsystentButelkowania';
import DziennikiWarzenia from './components/dzienniki/DziennikiWarzenia';
import AddDziennikWarzenia from './components/dzienniki/AddDziennikWarzenia';
import EditReviewPage from './components/Review/EditReviewPage';
import SzczegolyWarki from './components/dzienniki/SzczegolyWarki';
import PomyslyPage from './components/main/PomyslyPage';
import PasswordReset from './components/auth/PasswordReset';
import Quiz from './components/quiz/Quiz';
import ListaReceptur from './components/receptury/ListaReceptur';
import SzczegolyReceptury from './components/receptury/SzczegolyReceptury';
import HistoriaWarzenia from './components/dzienniki/HistoriaWarzenia';
import MojeSkladniki from './components/dzienniki/MojeSkladniki';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setIsLoggedIn(false);
    })
      .catch((error) => console.error('Błąd wylogowania', error));
  };

  return (
    <ThemeProvider theme={theme}>
      <>
        <Routes>
          {isLoggedIn === false ? (
            <>
              <Route path="/" element={<WelcomePage user={user} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login setUser={setUser} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/password-reset" element={<PasswordReset />} />
            </>
          ) : (
            <>
              <Route path="/" element={<MenuPage handleLogout={handleLogout} />} />
              <Route path="/add-review" element={<AddReviewPage />} />
              <Route path="/dzienniki" element={<DziennikiPage />} />
              <Route path="/kalkulatory" element={<KalkulatoryPage />} />
              <Route path="/receptury" element={<ListaReceptur />} />
              <Route path="/receptury/:id" element={<SzczegolyReceptury />} />
              <Route path="/ocenPiwo" element={<OcenPiwo />} />
              <Route path="/kalkulatory/blg" element={<BLGCalculator />} />
              <Route path="/kalkulatory/co2" element={<CO2Calculator />} />
              <Route path="/kalkulatory/ibu" element={<IbuCalculator />} />
              <Route path="/kalkulatory/temp" element={<TempCalculator />} />
              <Route path="/dzienniki/asystent-warzenia" element={<AsystentWarzenia />} />
              <Route path="/dzienniki/asystent-butelkowania" element={<AsystentButelkowania />} />
              <Route path="/dzienniki/warzenia" element={<DziennikiWarzenia />} />
              <Route path="/dzienniki/warzenia/add" element={<AddDziennikWarzenia />} />
              <Route path="/dzienniki/warzenia/:id" element={<SzczegolyWarki />} />
              <Route path="/dzienniki/historia-warzenia" element={<HistoriaWarzenia />} />
              <Route path="/dzienniki/moje-skladniki" element={<MojeSkladniki />} />
              <Route path="/my-reviews" element={<MyReviewsPage />} />
              <Route path="/pomysly" element={<PomyslyPage />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/review/:id" element={<ReviewDetailsPage />} />
              <Route path="/edit-review/:id" element={<EditReviewPage />} />
            </>
          )}
        </Routes>
      </>
    </ThemeProvider>
  );
}

export default App;
