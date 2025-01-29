import React from 'react';
import { Link } from 'react-router-dom';

function WelcomePage({ user }) {
  return (
    <div className="welcome-container">
      <h1 className="welcome-header">Witaj!</h1>
        {user ? (
                <p>Jesteś zalogowany jako: {user.email}</p>
            ) : null}
            <Link to="/login" className='link'>Zaloguj się</Link>
            <Link to="/register" className='link'>Zarejestruj</Link>
    </div>
  );
}

export default WelcomePage;
