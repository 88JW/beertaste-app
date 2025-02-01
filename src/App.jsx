import React, { useState, useEffect } from 'react'; 
import { Routes, Route } from 'react-router-dom';
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
import RecepturyPage from './components/receptury/RecepturyPage';
import OcenPiwo from './components/Review/OcenPiwo';
function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

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
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setUser(null);

        setIsLoggedIn(false);
    })
      .catch((error) => console.error('Błąd wylogowania', error));
  };

  return (
      <Routes>
          {isLoggedIn === false ? (
              <>
                  <Route path="/" element={<WelcomePage user={user}/>}/>
                  <Route path="/register" element={<Register/>}/>
                  <Route path="/login" element={<Login setUser={setUser} setIsLoggedIn={setIsLoggedIn}/>}/>
              </>
          ) : (
              <>
                  <Route path="/" element={<MenuPage handleLogout={handleLogout}/>}/>
                  <Route path="/add-review" element={<AddReviewPage/>}/>
                  <Route path="/dzienniki" element={<DziennikiPage/>}/>
                  <Route path="/kalkulatory" element={<KalkulatoryPage/>}/>
                  <Route path="/receptury" element={<RecepturyPage/>}/>
                  <Route path="/ocenPiwo" element={<OcenPiwo/>}/>
                  <Route path="/my-reviews" element={<MyReviewsPage />} /> 
                  <Route path="/review/:id" element={<ReviewDetailsPage />} />
          </>
        )}
    </Routes>
  );
}

export default App;
