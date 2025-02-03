import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import { db, auth} from '../../firebase';
import { TextField, Button, Checkbox, FormControlLabel, List, ListItem, ListItemText, Typography, Paper, Grid } from '@mui/material';

function SzczegolyWarki() {
  const { id } = useParams();
  const [warka, setWarka] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [dataPomiaru, setDataPomiaru] = useState(new Date());
  const [formData, setFormData] = useState({
    blg: '',
    temperatura: '',
    piana: false,
    co2: false, notatki: '',
  })
  const [przebiegFermentacji, setPrzebiegFermentacji] = useState([]); 

  const getPrzebiegFermentacji = async () => {
    const przebiegFermentacjiCollection = collection(db, "dziennikiWarzenia", id, "przebiegFermentacji");
    const przebiegFermentacjiSnapshot = await getDocs(przebiegFermentacjiCollection);
    const przebiegFermentacjiList = przebiegFermentacjiSnapshot.docs.map((doc) => {
      const dataPomiaru = doc.data().dataPomiaru ? doc.data().dataPomiaru.toDate() : null;
      return {
        id: doc.id,
        dataPomiaru,
        ...doc.data()
      }}).sort((a, b) => (b.dataPomiaru || 0) - (a.dataPomiaru || 0));
    
    setPrzebiegFermentacji(przebiegFermentacjiList);
  };

  const fetchDziennik = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return navigate('/dzienniki/warzenia');
    const warkaRef = doc(db, 'dziennikiWarzenia', id);
    const docSnap = await getDoc(warkaRef);


      if (docSnap.exists()) {
        if (!docSnap.data()) return navigate('/dzienniki/warzenia')
         if(docSnap.data().userId === userId){
           setWarka(docSnap.data());
           getPrzebiegFermentacji();
        } else {
        setWarka(null)
      }
    } else {
      console.log('Nie znaleziono dokumentu!');  
        }
      } catch (error) {
        console.error('Błąd pobierania danych:', error);
      } finally {
        
        setLoading(false);
      }
  };

  useEffect(() => {

    setLoading(true);

    fetchDziennik();
  }, [id]);

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (!warka) {
    return <div>Nie znaleziono warki.</div>;
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    

    setFormData(prevFormData => ({
      ...prevFormData, 
      ...(name === 'dataPomiaru' && setDataPomiaru(new Date(value))),
      
      [name]: type === 'checkbox' ? checked : value
    }));

  };

  const handleSubmit = async (event) => {
    
   

    event.preventDefault();
    try {
      
      const data = {
        ...formData,
        dataPomiaru: dataPomiaru,
      };
      const docRef = await addDoc(collection(db, 'dziennikiWarzenia', id, 'przebiegFermentacji'), data);
      const newPomiar = { id: docRef.id, ...formData, dataPomiaru: dataPomiaru };
      setFormData({ blg: '', temperatura: '', piana: false, co2: false, notatki: '' });
      setPrzebiegFermentacji((prevPrzebieg) => [newPomiar, ...prevPrzebieg]);
    } catch (error) {
      console.error('Błąd dodawania pomiaru:', error);
    } 
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1>Szczegóły Warki</h1>
        <Button component={Link} to="/dzienniki/warzenia" variant="contained" color="primary">
          Wstecz
        </Button>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '1rem' }}>
            <Typography variant="h6">Nazwa warki: {warka.nazwaWarki}</Typography>
            <Typography>Data nastawienia: {warka.dataNastawienia}</Typography>
            <Typography>Rodzaj piwa: {warka.rodzajPiwa}</Typography>
            <Typography>Drożdże: {warka.drozdze}</Typography>
            <Typography>Chmiele: {warka.chmiele}</Typography>
            <Typography>Rodzaj cukru: {warka.rodzajCukru}</Typography>
            <Typography>Notatki: {warka.notatki}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '1rem' }}>
          <Typography variant="h6">Dodaj pomiar</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                  type="datetime-local"
                  name="dataPomiaru"
                  value={dataPomiaru.toISOString().slice(0, 16)}
                  onChange={handleChange}
                   margin="normal"
                  fullWidth />
              <TextField label="BLG" name="blg" value={formData.blg} onChange={handleChange} margin="normal" fullWidth />
              <TextField label="Temperatura" name="temperatura" value={formData.temperatura} onChange={handleChange} margin="normal" fullWidth />
              <FormControlLabel
                control={<Checkbox name="piana" checked={formData.piana} onChange={handleChange} />}
                label="Piana"
              />
              <FormControlLabel
                control={<Checkbox name="co2" checked={formData.co2} onChange={handleChange} />}
                label="CO2"
              />
              <TextField
                label="Notatki"
                name="notatki"
                value={formData.notatki}
                onChange={handleChange}
                margin="normal"
                fullWidth
                multiline
              />
              <Button type="submit" variant="contained" color="primary">Zapisz</Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '1rem' }}>
          <Typography variant="h6">Przebieg fermentacji</Typography>
          <List>
            {przebiegFermentacji.map(item => (
              <ListItem key={item.id} >
                 <ListItemText primary={<Typography>Data: {item.dataPomiaru instanceof Date ? item.dataPomiaru.toLocaleDateString() + " " + item.dataPomiaru.toLocaleTimeString() : 'Brak daty'}</Typography>} secondary={<Typography>
                    BLG: {typeof item.blg === 'string' && item.blg}, 
                    Temperatura: {typeof item.temperatura === 'string' && item.temperatura}, 
                    Piana: {item.piana !== undefined && (item.piana ? 'Tak' : 'Nie')},
                    CO2: {item.co2 !== undefined && (item.co2 ? 'Tak' : 'Nie')}, 
                    Notatki: {typeof item.notatki === 'string' && item.notatki}
                    </Typography>} />

              </ListItem>
            ))}
          </List>
          </Paper>
        </Grid>

        <Button component={Link} to="/dzienniki/warzenia" variant="contained" color="primary">
          Powrót do warzenia
        </Button>
      </Grid>
    </div>
  );
}

export default SzczegolyWarki;