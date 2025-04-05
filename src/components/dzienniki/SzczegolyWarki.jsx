import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  doc, getDoc, collection, addDoc, getDocs, updateDoc, 
  Timestamp // Import Timestamp from the modular API
} from 'firebase/firestore';
import { db, auth} from '../../firebase';
import { 
  TextField, Button, Checkbox, FormControlLabel, List, ListItem, ListItemText, 
  Typography, Paper, Grid, Box, Collapse, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PrintIcon from '@mui/icons-material/Print';
import BookIcon from '@mui/icons-material/Book';
import ArchiveIcon from '@mui/icons-material/Archive'; // Dodaj import ikony archiwum

// Add a style for print view
const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    .print-content, .print-content * {
      visibility: visible;
    }
    .print-content {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    .no-print, .no-print * {
      display: none !important;
    }
    .page-break {
      page-break-before: always;
    }
  }
`;

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
    co2: false, 
    notatki: '',
  });
  const [przebiegFermentacji, setPrzebiegFermentacji] = useState([]); 
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nazwaWarki: '',
    dataNastawienia: '',
    rodzajPiwa: '',
    drozdze: '',
    chmiele: '',
    rodzajCukru: '',
    notatki: '',
  });
  
  // State for tracking expanded/collapsed sections
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    addMeasurement: true,
    fermentationProgress: true
  });

  // Function to toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getPrzebiegFermentacji = async () => {
    const przebiegFermentacjiCollection = collection(db, "dziennikiWarzenia", id, "przebiegFermentacji");
    const przebiegFermentacjiSnapshot = await getDocs(przebiegFermentacjiCollection);
    const przebiegFermentacjiList = przebiegFermentacjiSnapshot.docs.map((doc) => {
      // Extract the data first
      const data = doc.data();
      // Ensure the timestamp is properly converted to a Date object
      const dataPomiaru = data.dataPomiaru ? new Date(data.dataPomiaru.seconds * 1000) : null;
      return {
        id: doc.id,
        ...data,
        dataPomiaru // Override with the properly converted Date
      };
    }).sort((a, b) => (b.dataPomiaru || 0) - (a.dataPomiaru || 0));
    
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

  useEffect(() => {
    if (warka) {
      setEditFormData({
        nazwaWarki: warka.nazwaWarki || '',
        dataNastawienia: warka.dataNastawienia || '',
        rodzajPiwa: warka.rodzajPiwa || '',
        drozdze: warka.drozdze || '',
        chmiele: warka.chmiele || '',
        rodzajCukru: warka.rodzajCukru || '',
        notatki: warka.notatki || '',
      });
    }
  }, [warka]);

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (!warka) {
    return <div>Nie znaleziono warki.</div>;
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;    

    if (name === 'dataPomiaru') {      
      setDataPomiaru(new Date(value));
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const warkaRef = doc(db, 'dziennikiWarzenia', id);
      await updateDoc(warkaRef, editFormData);
      setWarka({...warka, ...editFormData});
      setIsEditing(false);
    } catch (error) {
      console.error('Błąd aktualizacji warki:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("Submitting form with data:", formData);
      // Convert the JavaScript Date to a Firestore timestamp using the modular API
      const data = {
        ...formData,
        dataPomiaru: Timestamp.fromDate(dataPomiaru),
      };

      const docRef = await addDoc(collection(db, 'dziennikiWarzenia', id, 'przebiegFermentacji'), data);
      console.log("Document added with ID:", docRef.id);
      
      // Create a new measurement object with a proper Date object
      const newPomiar = { 
        id: docRef.id, 
        ...formData, 
        dataPomiaru: new Date(dataPomiaru) // Ensure it's a proper Date object
      };
      
      // Reset form fields
      setFormData({ blg: '', temperatura: '', piana: false, co2: false, notatki: '' });
      
      // Update state with new measurement
      setPrzebiegFermentacji((prevPrzebieg) => [newPomiar, ...prevPrzebieg]);
    } catch (error) {
      console.error('Błąd dodawania pomiaru:', error);
      alert(`Nie udało się dodać pomiaru: ${error.message}`);
    }
  };

  // Handle print functionality
  const handlePrint = () => {
    // Expand all sections before printing
    setExpandedSections({
      details: true,
      addMeasurement: true,
      fermentationProgress: true
    });
    
    // Add a slight delay to ensure sections are expanded before printing
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Add function to save as recipe
  const handleSaveAsRecipe = async () => {
    try {
      // Create recipe data from current brew
      const recipeData = {
        nazwa: warka.nazwaWarki,
        rodzajPiwa: warka.rodzajPiwa,
        drozdze: warka.drozdze,
        chmiele: warka.chmiele,
        rodzajCukru: warka.rodzajCukru,
        notatki: warka.notatki,
        instrukcja: '', // Empty field for recipe instructions
        blg: przebiegFermentacji.length > 0 ? przebiegFermentacji[0].blg : '',
        dataDodania: Timestamp.now(),
        userId: auth.currentUser?.uid,
        zrodloWarkaId: id, // Reference to the original brew
      };

      // Validate all required fields
      const requiredFields = ['nazwa', 'blg'];
      for (const field of requiredFields) {
        if (!recipeData[field]) {
          throw new Error(`Pole "${field}" jest wymagane`);
        }
      }

      // Save the recipe to Firestore
      const docRef = await addDoc(collection(db, 'receptury'), recipeData);
      
      alert('Receptura została zapisana!');
      
      // Navigate to the recipe details page
      navigate(`/receptury/${docRef.id}`);
      
    } catch (error) {
      console.error('Błąd zapisywania receptury:', error);
      alert(`Nie udało się zapisać receptury: ${error.message}`);
    }
  };

  // Add function to archive brew
  const handleArchiveWarka = async () => {
    try {
      // Create archive data from current brew
      const archivedWarkaData = {
        ...warka,
        archiwizowano: Timestamp.now(),
        userId: auth.currentUser?.uid,
        warkaId: id, // Reference to the original brew
      };

      // Save the archive to Firestore
      const docRef = await addDoc(collection(db, 'archiwumWarzenia'), archivedWarkaData);
      
      alert('Warka została zarchiwizowana!');
      
      // Optionally mark the original brew as archived
      // await updateDoc(doc(db, 'dziennikiWarzenia', id), { isArchived: true });
      
    } catch (error) {
      console.error('Błąd archiwizacji warki:', error);
      alert(`Nie udało się zarchiwizować warki: ${error.message}`);
    }
  };

  return (
    <div>
      {/* Add print styles */}
      <style>{printStyles}</style>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="no-print">
        <h1>Szczegóły Warki</h1>
        <Box display="flex" gap={2}>
          <Button 
            startIcon={<ArchiveIcon />}
            variant="contained" 
            onClick={handleArchiveWarka} 
            color="warning"
          >
            Archiwizuj warkę
          </Button>
          <Button 
            startIcon={<BookIcon />}
            variant="contained" 
            onClick={handleSaveAsRecipe} 
            color="secondary"
          >
            Zapisz jako recepturę
          </Button>
          <Button 
            startIcon={<PrintIcon />}
            variant="outlined" 
            onClick={handlePrint} 
            color="primary"
          >
            Drukuj
          </Button>
          <Button component={Link} to="/dzienniki/warzenia" variant="contained" color="primary">
            Wstecz
          </Button>
        </Box>
      </div>
      
      {/* Title for print view */}
      <div className="print-content">
        <Typography variant="h4" gutterBottom>Dziennik Warzenia: {warka?.nazwaWarki}</Typography>
      </div>
      
      <Grid container spacing={2} className="print-content">
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '1rem' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                {!isEditing ? "Informacje o warce" : "Edytuj szczegóły warki"}
              </Typography>
              <Box display="flex" alignItems="center" className="no-print">
                {!isEditing && (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Edytuj
                  </Button>
                )}
                <IconButton onClick={() => toggleSection('details')} size="small">
                  {expandedSections.details ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            </Box>
            
            <Collapse in={expandedSections.details}>
              {!isEditing ? (
                <>
                  <Typography>Nazwa warki: {warka.nazwaWarki}</Typography>
                  <Typography>Data nastawienia: {warka.dataNastawienia}</Typography>
                  <Typography>Rodzaj piwa: {warka.rodzajPiwa}</Typography>
                  <Typography>Drożdże: {warka.drozdze}</Typography>
                  <Typography>Chmiele: {warka.chmiele}</Typography>
                  <Typography>Rodzaj cukru: {warka.rodzajCukru}</Typography>
                  <Typography sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
                    <strong>Notatki:</strong><br />
                    {warka.notatki}
                  </Typography>
                </>
              ) : (
                <>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Nazwa Warki"
                    name="nazwaWarki"
                    value={editFormData.nazwaWarki}
                    onChange={handleEditChange}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    type="date"
                    name="dataNastawienia"
                    value={editFormData.dataNastawienia}
                    onChange={handleEditChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Rodzaj Piwa"
                    name="rodzajPiwa"
                    value={editFormData.rodzajPiwa}
                    onChange={handleEditChange}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Drożdże"
                    name="drozdze"
                    value={editFormData.drozdze}
                    onChange={handleEditChange}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Chmiele"
                    name="chmiele"
                    value={editFormData.chmiele}
                    onChange={handleEditChange}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Rodzaj Cukru"
                    name="rodzajCukru"
                    value={editFormData.rodzajCukru}
                    onChange={handleEditChange}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Notatki"
                    name="notatki"
                    value={editFormData.notatki}
                    onChange={handleEditChange}
                    multiline
                    minRows={3}
                    sx={{
                      '& .MuiInputBase-root': {
                        resize: 'vertical',
                        overflow: 'auto',
                        minHeight: '100px',
                      },
                      '& textarea': {
                        resize: 'vertical',
                        overflow: 'auto',
                        transition: 'none',
                      }
                    }}
                  />
                  <Box mt={2} display="flex" gap={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveEdit}
                    >
                      Zapisz
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => setIsEditing(false)}
                    >
                      Anuluj
                    </Button>
                  </Box>
                </>
              )}
            </Collapse>
          </Paper>
        </Grid>
        
        <Grid item xs={12} className="no-print">
          <Paper elevation={3} style={{ padding: '1rem' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Dodaj pomiar</Typography>
              <IconButton onClick={() => toggleSection('addMeasurement')} size="small">
                {expandedSections.addMeasurement ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            
            <Collapse in={expandedSections.addMeasurement}>
              <form onSubmit={handleSubmit}>
                <TextField
                  type="datetime-local"
                  name="dataPomiaru"
                  label="Data pomiaru"
                  value={dataPomiaru.toISOString().slice(0, 16)}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth 
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField 
                  label="BLG" 
                  name="blg" 
                  value={formData.blg} 
                  onChange={handleChange} 
                  margin="normal" 
                  fullWidth 
                />
                <TextField 
                  label="Temperatura" 
                  name="temperatura" 
                  value={formData.temperatura} 
                  onChange={handleChange} 
                  margin="normal" 
                  fullWidth 
                />
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
                  minRows={2}
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Zapisz pomiar
                </Button>
              </form>
            </Collapse>
          </Paper>
        </Grid>
        
        <Grid item xs={12} className="page-break">
          <Paper elevation={3} style={{ padding: '1rem' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Przebieg fermentacji</Typography>
              <IconButton onClick={() => toggleSection('fermentationProgress')} size="small" className="no-print">
                {expandedSections.fermentationProgress ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            
            <Collapse in={expandedSections.fermentationProgress}>
              <List>
                {przebiegFermentacji.map(item => (
                  <ListItem key={item.id}>
                    <ListItemText 
                      primary={
                        <Typography>
                          Data: {item.dataPomiaru && item.dataPomiaru instanceof Date && !isNaN(item.dataPomiaru) 
                            ? item.dataPomiaru.toLocaleDateString() + " " + item.dataPomiaru.toLocaleTimeString() 
                            : 'Brak daty'}
                        </Typography>
                      } 
                      secondary={<Typography>
                        BLG: {typeof item.blg === 'string' && item.blg}, 
                        Temperatura: {typeof item.temperatura === 'string' && item.temperatura}, 
                        Piana: {item.piana !== undefined && (item.piana ? 'Tak' : 'Nie')},
                        CO2: {item.co2 !== undefined && (item.co2 ? 'Tak' : 'Nie')}, 
                        {typeof item.notatki === 'string' && item.notatki.trim() && (
                          <>
                            <br /><strong>Notatki:</strong><br />
                            <span style={{ whiteSpace: 'pre-wrap' }}>{item.notatki}</span>
                          </>
                        )}
                      </Typography>}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Paper>
        </Grid>
      </Grid>
      <Button component={Link} to="/dzienniki/warzenia" variant="contained" color="primary" sx={{ mt: 2 }} className="no-print">
        Powrót do warzenia
      </Button>
    </div>
  );
}

export default SzczegolyWarki;