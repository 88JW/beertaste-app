import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { Grid, Paper, Typography } from "@mui/material";

function DziennikiWarzenia() {
  const [dzienniki, setDzienniki] = useState([]);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchDzienniki = async () => {
        if(!auth.currentUser){
            return
        }
      const userId = auth.currentUser.uid;
      const dziennikiCollection = collection(db, "dziennikiWarzenia");      
      const q = query(dziennikiCollection, where("userId", "==", userId));
      const dziennikiSnapshot = await getDocs(q);
      const dziennikiList = dziennikiSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDzienniki(dziennikiList);
    };
    fetchDzienniki();
  }, []);

    const handleDiaryClick = (id) => {
        navigate(`/dzienniki/warzenia/${id}`);
    }

  return (
    <div>
      <h1>Dzienniki Warzenia</h1>
      <p>Tutaj znajdują się Twoje dzienniki warzenia.</p>
      <Link to="/dzienniki/warzenia/add">
          <button>Dodaj nowy dziennik</button>
      </Link>
      <Grid container spacing={2}>
        {dzienniki.map((dziennik) => (
          <Grid item xs={12} sm={6} md={4} key={dziennik.id}>
            <Paper elevation={3} style={{ padding: "1rem" , cursor:"pointer"}} onClick={() => handleDiaryClick(dziennik.id)}>
              <Typography variant="h6">
                Nazwa warki: {dziennik.nazwaWarki}
              </Typography>
              <Typography>
                Data nastawienia: {dziennik.dataNastawienia}
              </Typography>
              <Typography>Rodzaj piwa: {dziennik.rodzajPiwa}</Typography>
              <Typography>Drożdże: {dziennik.drozdz}</Typography>
              <Typography>Chmiele: {dziennik.chmiel}</Typography>
              <Typography>Rodzaj cukru: {dziennik.rodzajCukru}</Typography>
              <Typography>Notatki: {dziennik.notatki}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default DziennikiWarzenia;