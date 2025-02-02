import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { db } from '../../firebase';

function SzczegolyWarki() {
  const { id } = useParams();
  const [warka, setWarka] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarka = async () => {
      setLoading(true);
      try {
        const warkaRef = doc(db, 'dziennikiWarzenia', id);
        const docSnap = await getDoc(warkaRef);

        if (docSnap.exists()) {
          setWarka(docSnap.data());
        } else {
          console.log('Nie znaleziono dokumentu!');
        }
      } catch (error) {
        console.error('Błąd pobierania danych:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWarka();
  }, [id]);

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (!warka) {
    return <div>Nie znaleziono warki.</div>;
  }

  return (
    <div>
      <h1>Szczegóły Warki</h1>
      <p>Nazwa warki: {warka.nazwaWarki}</p>
      <p>Data nastawienia: {warka.dataNastawienia}</p>
      <p>Rodzaj piwa: {warka.rodzajPiwa}</p>
      <p>Drożdże: {warka.drozdze}</p>
      <p>Chmiele: {warka.chmiele}</p>
      <p>Rodzaj cukru: {warka.rodzajCukru}</p>
      <p>Notatki: {warka.notatki}</p>
    </div>
  );
}

export default SzczegolyWarki;