import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  doc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc, 
  Timestamp // Import Timestamp from the modular API
} from 'firebase/firestore';
import { db, auth} from '../../firebase';
import { 
  TextField, Button, Checkbox, FormControlLabel, List, ListItem, ListItemText, 
  Typography, Paper, Grid, Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Import useTheme
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PrintIcon from '@mui/icons-material/Print';
import BookIcon from '@mui/icons-material/Book';
import ArchiveIcon from '@mui/icons-material/Archive'; // Dodaj import ikony archiwum
import DeleteIcon from '@mui/icons-material/Delete'; // Dodaj import ikony usuwania
import NotesIcon from '@mui/icons-material/Notes'; // Dodaj import ikony notatek

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

// Dodajmy pomocniczą funkcję do bezpiecznego formatowania daty
const formatDate = (timestamp) => {
  if (!timestamp) return "Brak daty";
  
  try {
    // Obsługa różnych formatów timestamp z Firestore
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    } else if (timestamp instanceof Date) {
      return timestamp.toLocaleString();
    } else if (typeof timestamp === 'string') {
      return new Date(timestamp).toLocaleString();
    } else if (typeof timestamp === 'number') {
      return new Date(timestamp).toLocaleString();
    }
    return "Format daty nieznany";
  } catch (error) {
    console.error("Błąd formatowania daty:", error);
    return "Błąd daty";
  }
};

function SzczegolyWarki() {
  const { id } = useParams();
  const [warka, setWarka] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme(); // Get the theme
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Use theme properly
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
    details: !isMobile,
    addMeasurement: !isMobile,
    fermentationProgress: !isMobile
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
      const data = doc.data();
      const dataPomiaru = data.dataPomiaru ? new Date(data.dataPomiaru.seconds * 1000) : null;
      return {
        id: doc.id,
        ...data,
        dataPomiaru
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
    setExpandedSections(prev => ({
      details: !isMobile ? true : prev.details,
      addMeasurement: !isMobile ? true : prev.addMeasurement,
      fermentationProgress: !isMobile ? true : prev.fermentationProgress
    }));
  }, [isMobile]);

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
      const data = {
        ...formData,
        dataPomiaru: Timestamp.fromDate(dataPomiaru),
      };

      const docRef = await addDoc(collection(db, 'dziennikiWarzenia', id, 'przebiegFermentacji'), data);
      console.log("Document added with ID:", docRef.id);
      
      const newPomiar = { 
        id: docRef.id, 
        ...formData, 
        dataPomiaru: new Date(dataPomiaru)
      };
      
      setFormData({ blg: '', temperatura: '', piana: false, co2: false, notatki: '' });
      setPrzebiegFermentacji((prevPrzebieg) => [newPomiar, ...prevPrzebieg]);
    } catch (error) {
      console.error('Błąd dodawania pomiaru:', error);
      alert(`Nie udało się dodać pomiaru: ${error.message}`);
    }
  };

  const handlePrint = () => {
    setExpandedSections({
      details: true,
      addMeasurement: true,
      fermentationProgress: true
    });
    
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleSaveAsRecipe = async () => {
    try {
      const recipeData = {
        nazwa: warka.nazwaWarki,
        rodzajPiwa: warka.rodzajPiwa,
        drozdze: warka.drozdze,
        chmiele: warka.chmiele,
        rodzajCukru: warka.rodzajCukru,
        notatki: warka.notatki,
        instrukcja: '',
        blg: przebiegFermentacji.length > 0 ? przebiegFermentacji[0].blg : '',
        dataDodania: Timestamp.now(),
        userId: auth.currentUser?.uid,
        zrodloWarkaId: id,
      };

      const requiredFields = ['nazwa', 'blg'];
      for (const field of requiredFields) {
        if (!recipeData[field]) {
          throw new Error(`Pole "${field}" jest wymagane`);
        }
      }

      const docRef = await addDoc(collection(db, 'receptury'), recipeData);
      alert('Receptura została zapisana!');
      navigate(`/receptury/${docRef.id}`);
    } catch (error) {
      console.error('Błąd zapisywania receptury:', error);
      alert(`Nie udało się zapisać receptury: ${error.message}`);
    }
  };

  const handleArchiveWarka = async () => {
    try {
      const archivedWarkaData = {
        ...warka,
        archiwizowano: Timestamp.now(),
        userId: auth.currentUser?.uid,
        warkaId: id,
      };

      const docRef = await addDoc(collection(db, 'archiwumWarzenia'), archivedWarkaData);
      alert('Warka została zarchiwizowana!');
    } catch (error) {
      console.error('Błąd archiwizacji warki:', error);
      alert(`Nie udało się zarchiwizować warki: ${error.message}`);
    }
  };

  const handleDeletePomiar = async (pomiarId) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten pomiar? Tej operacji nie można cofnąć.")) {
      try {
        await deleteDoc(doc(db, "dziennikiWarzenia", id, "przebiegFermentacji", pomiarId));
        setPrzebiegFermentacji(prevPrzebieg => 
          prevPrzebieg.filter(pomiar => pomiar.id !== pomiarId)
        );
        alert("Pomiar został usunięty.");
      } catch (error) {
        console.error("Błąd usuwania pomiaru:", error);
        alert(`Nie udało się usunąć pomiaru: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <style>{printStyles}</style>
      <div className="no-print">
        <Typography variant="h5" component="h1" sx={{ 
          mb: { xs: 1, sm: 2 }, 
          mt: { xs: 0.5, sm: 1 },
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
        }}>
          Szczegóły Warki
        </Typography>
      </div>
      
      <Grid container spacing={{ xs: 1, sm: 2 }} className="print-content">
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            <Box display="flex" 
              flexDirection={{ xs: 'column', sm: 'row' }} 
              justifyContent="space-between" 
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              mb={{ xs: 1, sm: 2 }}>
              <Typography variant="h6" sx={{ 
                mb: { xs: 1, sm: 0 },
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}>
                {!isEditing ? "Informacje o warce" : "Edytuj szczegóły warki"}
              </Typography>
              <Box display="flex" 
                alignItems="center" 
                className="no-print"
                flexWrap="wrap"
                gap={0.5}>
                {!isEditing && (
                  <Button 
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    variant="outlined"
                    size="small"
                    sx={{ py: { xs: 0.5 }, px: { xs: 1 } }}
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
                  <Grid container spacing={{ xs: 1, sm: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        <strong>Nazwa warki:</strong> {warka.nazwaWarki}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        <strong>Data nastawienia:</strong> {warka.dataNastawienia}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        <strong>Rodzaj piwa:</strong> {warka.rodzajPiwa}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        <strong>Drożdże:</strong> {warka.drozdze}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        <strong>Chmiele:</strong> {warka.chmiele}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        <strong>Rodzaj cukru:</strong> {warka.rodzajCukru}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography sx={{ whiteSpace: 'pre-wrap', mt: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        <strong>Notatki:</strong><br />
                        {warka.notatki}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid container spacing={{ xs: 1, sm: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nazwa Warki"
                        name="nazwaWarki"
                        value={editFormData.nazwaWarki}
                        onChange={handleEditChange}
                        size={isMobile ? "small" : "medium"}
                        margin={isMobile ? "dense" : "normal"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Data nastawienia"
                        name="dataNastawienia"
                        value={editFormData.dataNastawienia}
                        onChange={handleEditChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        size={isMobile ? "small" : "medium"}
                        margin={isMobile ? "dense" : "normal"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Rodzaj Piwa"
                        name="rodzajPiwa"
                        value={editFormData.rodzajPiwa}
                        onChange={handleEditChange}
                        size={isMobile ? "small" : "medium"}
                        margin={isMobile ? "dense" : "normal"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Drożdże"
                        name="drozdze"
                        value={editFormData.drozdze}
                        onChange={handleEditChange}
                        size={isMobile ? "small" : "medium"}
                        margin={isMobile ? "dense" : "normal"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Chmiele"
                        name="chmiele"
                        value={editFormData.chmiele}
                        onChange={handleEditChange}
                        size={isMobile ? "small" : "medium"}
                        margin={isMobile ? "dense" : "normal"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Rodzaj Cukru"
                        name="rodzajCukru"
                        value={editFormData.rodzajCukru}
                        onChange={handleEditChange}
                        size={isMobile ? "small" : "medium"}
                        margin={isMobile ? "dense" : "normal"}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Notatki"
                        name="notatki"
                        value={editFormData.notatki}
                        onChange={handleEditChange}
                        multiline
                        minRows={isMobile ? 2 : 3}
                        size={isMobile ? "small" : "medium"}
                        margin={isMobile ? "dense" : "normal"}
                        sx={{
                          '& .MuiInputBase-root': {
                            resize: 'vertical',
                            overflow: 'auto',
                            minHeight: { xs: '80px', sm: '100px' },
                          },
                          '& textarea': {
                            resize: 'vertical',
                            overflow: 'auto',
                            transition: 'none',
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box mt={{ xs: 1, sm: 2 }} display="flex" gap={{ xs: 1, sm: 2 }} flexDirection={{ xs: 'column', sm: 'row' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<SaveIcon />}
                          onClick={handleSaveEdit}
                          fullWidth={isMobile}
                          size={isMobile ? "small" : "medium"}
                        >
                          Zapisz
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() => setIsEditing(false)}
                          fullWidth={isMobile}
                          size={isMobile ? "small" : "medium"}
                        >
                          Anuluj
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </>
              )}
            </Collapse>
          </Paper>
        </Grid>
        
        <Grid item xs={12} className="no-print">
          <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Dodaj pomiar
              </Typography>
              <IconButton onClick={() => toggleSection('addMeasurement')} size="small">
                {expandedSections.addMeasurement ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            
            <Collapse in={expandedSections.addMeasurement}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="datetime-local"
                      name="dataPomiaru"
                      label="Data pomiaru"
                      value={dataPomiaru.toISOString().slice(0, 16)}
                      onChange={handleChange}
                      margin={isMobile ? "dense" : "normal"}
                      size={isMobile ? "small" : "medium"}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      label="BLG"
                      name="blg"
                      value={formData.blg} 
                      onChange={handleChange} 
                      margin={isMobile ? "dense" : "normal"} 
                      size={isMobile ? "small" : "medium"}
                      fullWidth 
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField 
                      label="Temperatura" 
                      name="temperatura" 
                      value={formData.temperatura} 
                      onChange={handleChange} 
                      margin={isMobile ? "dense" : "normal"} 
                      size={isMobile ? "small" : "medium"}
                      fullWidth 
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={<Checkbox name="piana" checked={formData.piana} onChange={handleChange} />}
                      label="Piana"
                      sx={{ '& .MuiTypography-root': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={<Checkbox name="co2" checked={formData.co2} onChange={handleChange} />}
                      label="CO2"
                      sx={{ '& .MuiTypography-root': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Notatki"
                      name="notatki"
                      value={formData.notatki}
                      onChange={handleChange}
                      margin={isMobile ? "dense" : "normal"}
                      size={isMobile ? "small" : "medium"}
                      fullWidth
                      multiline
                      rows={isMobile ? 2 : 3}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                      sx={{ mt: { xs: 1, sm: 2 } }}
                    >
                      Dodaj pomiar
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Collapse>
          </Paper>
        </Grid>
        
        <Grid item xs={12} className="page-break">
          <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Przebieg fermentacji
              </Typography>
              <IconButton onClick={() => toggleSection('fermentationProgress')} size="small" className="no-print">
                {expandedSections.fermentationProgress ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            
            <Collapse in={expandedSections.fermentationProgress}>
              {przebiegFermentacji.length > 0 ? (
                <Box sx={{ overflowX: 'auto' }}>
                  <TableContainer component={Paper} sx={{ mt: { xs: 1, sm: 2 } }}>
                    <Table size="small" sx={{ 
                      '& .MuiTableCell-root': {
                        px: { xs: 1, sm: 2 },
                        py: { xs: 0.75, sm: 1 },
                        fontSize: { xs: '0.7rem', sm: '0.875rem' }
                      }
                    }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Data</TableCell>
                          <TableCell>BLG</TableCell>
                          <TableCell>Temp.</TableCell>
                          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Piana</TableCell>
                          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>CO2</TableCell>
                          <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Notatki</TableCell>
                          <TableCell align="right">Akcje</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {przebiegFermentacji.map((pomiar) => (
                          <TableRow key={pomiar.id}>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                              {formatDate(pomiar.dataPomiaru)}
                            </TableCell>
                            <TableCell>{pomiar.blg}</TableCell>
                            <TableCell>{pomiar.temperatura}</TableCell>
                            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{pomiar.piana ? "Tak" : "Nie"}</TableCell>
                            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{pomiar.co2 ? "Tak" : "Nie"}</TableCell>
                            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                              {pomiar.notatki}
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton 
                                  size="small" 
                                  color="error" 
                                  onClick={() => handleDeletePomiar(pomiar.id)}
                                  title="Usuń pomiar"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                                <IconButton 
                                  size="small"
                                  sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                                  onClick={() => alert(pomiar.notatki || 'Brak notatek')}
                                  disabled={!pomiar.notatki}
                                >
                                  <NotesIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : (
                <Typography sx={{ mt: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Brak wpisów w przebiegu fermentacji
                </Typography>
              )}
              
              <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 2 }}>
                {przebiegFermentacji.length > 0 && (
                  <>
                    <Typography variant="subtitle2" gutterBottom sx={{
                      fontSize: '0.8rem',
                      fontStyle: 'italic',
                      color: 'text.secondary'
                    }}>
                      Przesuń w lewo, aby zobaczyć więcej pomiarów
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {przebiegFermentacji.map((pomiar) => (
                        <Paper 
                          key={pomiar.id} 
                          elevation={1} 
                          sx={{
                            mb: 1, 
                            p: 1.5,
                            fontSize: '0.8rem'
                          }}
                        >
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                              {formatDate(pomiar.dataPomiaru)}
                            </Typography>
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => handleDeletePomiar(pomiar.id)}
                              sx={{ p: 0.5 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Box mt={1}>
                            <Grid container spacing={1}>
                              <Grid item xs={6}>
                                <Typography variant="body2">
                                  <strong>BLG:</strong> {pomiar.blg}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2">
                                  <strong>Temp:</strong> {pomiar.temperatura}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2">
                                  <strong>Piana:</strong> {pomiar.piana ? "Tak" : "Nie"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2">
                                  <strong>CO2:</strong> {pomiar.co2 ? "Tak" : "Nie"}
                                </Typography>
                              </Grid>
                              {pomiar.notatki && (
                                <Grid item xs={12}>
                                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                    <strong>Notatki:</strong> {pomiar.notatki}
                                  </Typography>
                                </Grid>
                              )}
                            </Grid>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  </>
                )}
              </Box>
            </Collapse>
          </Paper>
        </Grid>
        
        <Grid item xs={12} className="no-print">
          <Box 
            display="flex" 
            flexDirection={{ xs: 'column', sm: 'row' }} 
            gap={{ xs: 0.75, sm: 1 }} 
            mt={{ xs: 1, sm: 2 }} 
            mb={{ xs: 1, sm: 2 }} 
            sx={{ '& > button': { width: { xs: '100%', sm: 'auto' } } }}
          >
            <Button 
              variant="contained" 
              color="warning" 
              onClick={handleArchiveWarka}
              startIcon={<ArchiveIcon />}
              size={isMobile ? "small" : "medium"}
            >
              Archiwizuj
            </Button>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleSaveAsRecipe}
              startIcon={<BookIcon />}
              size={isMobile ? "small" : "medium"}
            >
              Zapisz recepturę
            </Button>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={handlePrint}
              startIcon={<PrintIcon />}
              size={isMobile ? "small" : "medium"}
            >
              Drukuj
            </Button>
          </Box>
          <Button 
            component={Link} 
            to="/dzienniki/warzenia" 
            variant="contained" 
            color="primary" 
            sx={{ mt: { xs: 0.5, sm: 2 } }} 
            className="no-print"
            size={isMobile ? "small" : "medium"}
            fullWidth={isMobile}
          >
            Powrót do warzenia
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default SzczegolyWarki;