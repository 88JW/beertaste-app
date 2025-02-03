import React, { useState } from 'react'
import { collection, addDoc, doc } from 'firebase/firestore';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button';
import { db } from '../../firebase';

function AddDziennikWarzenia() {
  const currentDate = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    nazwaWarki: '',
    dataNastawienia: currentDate,
    rodzajPiwa: '',
    drozdze: '',
    chmiele: '',
    rodzajCukru: '',
    notatki: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const userId = auth.currentUser.uid

    const formDataWithUserId = {...formData, userId}
    try {
      const docRef = await addDoc(collection(db, "dziennikiWarzenia"), formDataWithUserId);
      console.log("Dodano nową warkę z id: ", docRef.id);

      // Tworzenie subkolekcji "przebiegFermentacji" dla nowo utworzonego dokumentu
      await addDoc(collection(db, "dziennikiWarzenia", docRef.id, "przebiegFermentacji"), {});
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setFormData({
      nazwaWarki: '',
      dataNastawienia: currentDate,
      rodzajPiwa: '',
      drozdze: '',
      chmiele: '',
      rodzajCukru: '',
      notatki: '',
    });
  };

  return (
    <div>
      <h2>Dodaj nowy Dziennik Warzenia</h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{padding: "10px"}}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nazwa Warki"
              id="nazwaWarki"
              name="nazwaWarki"
              value={formData.nazwaWarki}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="date"
              id="dataNastawienia"
              name="dataNastawienia"
              value={formData.dataNastawienia}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Rodzaj Piwa"
              id="rodzajPiwa"
              name="rodzajPiwa"
              value={formData.rodzajPiwa}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Drożdże"
              id="drozdze"
              name="drozdze"
              value={formData.drozdze}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Chmiele"
              id="chmiele"
              name="chmiele"
              value={formData.chmiele}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Rodzaj Cukru"
              id="rodzajCukru"
              name="rodzajCukru"
              value={formData.rodzajCukru}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notatki"
              id="notatki"
              name="notatki"
              value={formData.notatki}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained">Zapisz</Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
  
}

export default AddDziennikWarzenia;
import { auth } from '../../firebase';