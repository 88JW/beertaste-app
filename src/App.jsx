import React, { useState, useEffect } from 'react'; 
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import MenuPage from './components/MenuPage';
import Register from './components/Register';
import WelcomePage from './components/WelcomePage';
import MyReviewsPage from './components/MyReviewsPage';
import ReviewDetailsPage from './components/ReviewDetailsPage';
import { auth } from './firebase';
import AddReviewPage from './components/AddReviewPage';
import { onAuthStateChanged, signOut } from 'firebase/auth';

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
    signOut(auth)
    .then(() => {
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
                  <Route path="/my-reviews" element={<MyReviewsPage />} /> 
                  <Route path="/review/:id" element={<ReviewDetailsPage />} />
          </>
        )}
    </Routes>
  );
}

export default App;
