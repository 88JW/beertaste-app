import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Button, Grid, Paper, Typography, Box } from "@mui/material";
import { db, auth } from "../../firebase";

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
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4">Dzienniki Warzenia</Typography>
          
      </Box>
      <Link to="/dzienniki/warzenia/add">
          <Button variant="contained" color="secondary">Dodaj nowy dziennik</Button>
      </Link>
      <Grid container spacing={2} sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: (theme) => theme.spacing(2)
        }}>
        {dzienniki.map((dziennik) => (
          <Grid item sx={{
              flexBasis: '20rem',
              padding: (theme) => theme.spacing(1)
            }} key={dziennik.id}>
            <Paper elevation={3} sx={{
              padding: (theme) => theme.spacing(2),
              maxWidth: '30rem',
              cursor:"pointer"}} onClick={() => handleDiaryClick(dziennik.id)}>
              <Typography variant="h6">
                Nazwa warki: {dziennik.nazwaWarki}
              </Typography>
              <Typography >
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
      <br></br>
      <Button
            component={Link}
            to="/dzienniki"
            variant="contained"
            color="primary"
          >
            Wstecz
          </Button>
    </Box>
  );
}

export default DziennikiWarzenia;