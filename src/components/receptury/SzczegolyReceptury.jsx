import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { 
  TextField, Button, Typography, Paper, Grid, Box, Divider,
  IconButton, Card, CardContent, CardHeader, CardActions, Chip,
  Rating, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, 
  List, ListItem, ListItemIcon, ListItemText, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import GrassIcon from '@mui/icons-material/Grass';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import PermDataSettingIcon from '@mui/icons-material/PermDataSetting';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StraightenIcon from '@mui/icons-material/Straighten';
import NotesIcon from '@mui/icons-material/Notes';

function SzczegolyReceptury() {
  const { id } = useParams();
  const [receptura, setReceptura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nazwa: '',
    rodzajPiwa: '',
    drozdze: '',
    chmiele: '',
    rodzajCukru: '',
    instrukcja: '',
    notatki: '',
    blg: ''
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReceptura = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return navigate('/receptury');
        
        const recepturaRef = doc(db, 'receptury', id);
        const docSnap = await getDoc(recepturaRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.userId === userId) {
            setReceptura(data);
            setEditFormData({
              nazwa: data.nazwa || '',
              rodzajPiwa: data.rodzajPiwa || '',
              drozdze: data.drozdze || '',
              chmiele: data.chmiele || '',
              rodzajCukru: data.rodzajCukru || '',
              instrukcja: data.instrukcja || '',
              notatki: data.notatki || '',
              blg: data.blg || ''
            });
          } else {
            navigate('/receptury');
          }
        } else {
          navigate('/receptury');
        }
      } catch (error) {
        console.error('Błąd pobierania receptury:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceptura();
  }, [id, navigate]);

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const recepturaRef = doc(db, 'receptury', id);
      await updateDoc(recepturaRef, editFormData);
      setReceptura({...receptura, ...editFormData});
      setIsEditing(false);
    } catch (error) {
      console.error('Błąd aktualizacji receptury:', error);
      alert(`Nie udało się zaktualizować receptury: ${error.message}`);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDoc(doc(db, 'receptury', id));
      alert('Receptura została usunięta');
      navigate('/receptury');
    } catch (error) {
      console.error('Błąd usuwania receptury:', error);
      alert(`Nie udało się usunąć receptury: ${error.message}`);
    }
  };

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (!receptura) {
    return <div>Receptura nie znaleziona.</div>;
  }

  return (
   <Box 
         sx={{ 
           position: 'absolute',
           left: 0,
           right: 0,
           top: 0, // Add this to position at the top
           marginLeft: 'auto',
           marginRight: 'auto',
           width: '100%',
           maxWidth: '100%',
           boxSizing: 'border-box',
           overflow: 'hidden',
           transform: 'translateX(-0px)'  // Counteract right shift
         }}
       >
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />} 
        component={Link} 
        to="/receptury"
        sx={{ mb: 3 }}
      >
        Powrót do receptur
      </Button>

      <Card sx={{ 
        mb: 4, 
        boxShadow: 3, 
        borderRadius: 3,
        overflow: 'hidden',
        backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(245,245,245,0.9))'
      }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalDrinkIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                {receptura.nazwa || "Receptura bez nazwy"}
              </Typography>
            </Box>
          }
          action={
            !isEditing && (
              <Box>
                <IconButton onClick={() => setIsEditing(true)} sx={{ mr: 1 }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={handleDeleteClick} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            )
          }
          sx={{ 
            bgcolor: 'rgba(0,0,0,0.02)',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            pb: 2
          }}
        />

        <Divider />
        
        <CardContent sx={{ py: 3 }}>
          {!isEditing ? (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ 
                  p: 3, 
                  height: '100%', 
                  bgcolor: '#f7f9fc', 
                  borderRadius: 3,
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    pb: 1,
                    borderBottom: '2px solid rgba(0,0,0,0.1)'
                  }}>
                    <PermDataSettingIcon sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="h6" fontWeight="bold" color="secondary">
                      Informacje o recepturze
                    </Typography>
                  </Box>
                  
                  <List disablePadding>
                    <ListItem sx={{ py: 1 }}>
                      <ListItemIcon>
                        <LocalDrinkIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Rodzaj piwa" 
                        secondary={receptura.rodzajPiwa || "Nie określono"}
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ py: 1 }}>
                      <ListItemIcon>
                        <BubbleChartIcon color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Drożdże" 
                        secondary={receptura.drozdze || "Nie określono"}
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ py: 1 }}>
                      <ListItemIcon>
                        <GrassIcon color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Chmiele" 
                        secondary={receptura.chmiele || "Nie określono"}
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ py: 1 }}>
                      <ListItemIcon>
                        <EmojiFoodBeverageIcon color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Rodzaj cukru" 
                        secondary={receptura.rodzajCukru || "Nie określono"}
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ py: 1 }}>
                      <ListItemIcon>
                        <StraightenIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Końcowe BLG" 
                        secondary={receptura.blg || "Nie określono"}
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ 
                  p: 3, 
                  height: '100%', 
                  bgcolor: '#f7f9fc', 
                  borderRadius: 3,
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    pb: 1,
                    borderBottom: '2px solid rgba(0,0,0,0.1)'
                  }}>
                    <MenuBookIcon sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="h6" fontWeight="bold" color="secondary">
                      Instrukcja
                    </Typography>
                  </Box>
                  <Typography sx={{ 
                    whiteSpace: 'pre-wrap',
                    px: 2,
                    py: 1,
                    backgroundColor: receptura.instrukcja ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.03)',
                    borderRadius: 2,
                    border: '1px solid rgba(0,0,0,0.05)',
                    minHeight: '200px'
                  }}>
                    {receptura.instrukcja || "Brak instrukcji. Kliknij 'Edytuj' aby dodać instrukcję warzenia."}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={2} sx={{ 
                  p: 3, 
                  bgcolor: '#f7f9fc', 
                  borderRadius: 3,
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    pb: 1,
                    borderBottom: '2px solid rgba(0,0,0,0.1)'
                  }}>
                    <NotesIcon sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="h6" fontWeight="bold" color="secondary">
                      Notatki
                    </Typography>
                  </Box>
                  <Typography sx={{ 
                    whiteSpace: 'pre-wrap',
                    px: 2,
                    py: 1,
                    backgroundColor: receptura.notatki ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.03)',
                    borderRadius: 2,
                    border: '1px solid rgba(0,0,0,0.05)',
                    minHeight: '100px'
                  }}>
                    {receptura.notatki || "Brak notatek."}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nazwa receptury"
                  name="nazwa"
                  value={editFormData.nazwa}
                  onChange={handleEditChange}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Rodzaj piwa"
                  name="rodzajPiwa"
                  value={editFormData.rodzajPiwa}
                  onChange={handleEditChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Drożdże"
                  name="drozdze"
                  value={editFormData.drozdze}
                  onChange={handleEditChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Chmiele"
                  name="chmiele"
                  value={editFormData.chmiele}
                  onChange={handleEditChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Rodzaj cukru"
                  name="rodzajCukru"
                  value={editFormData.rodzajCukru}
                  onChange={handleEditChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Ekstrakt (BLG)"
                  name="blg"
                  value={editFormData.blg}
                  onChange={handleEditChange}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Instrukcja"
                  name="instrukcja"
                  value={editFormData.instrukcja}
                  onChange={handleEditChange}
                  margin="normal"
                  multiline
                  rows={8}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notatki"
                  name="notatki"
                  value={editFormData.notatki}
                  onChange={handleEditChange}
                  margin="normal"
                  multiline
                  rows={4}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveEdit}
                    color="primary"
                  >
                    Zapisz zmiany
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => setIsEditing(false)}
                  >
                    Anuluj
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </CardContent>
        
        {!isEditing && (
          <CardActions sx={{ 
            justifyContent: 'flex-end', 
            p: 3, 
            bgcolor: 'rgba(0,0,0,0.02)',
            borderTop: '1px solid rgba(0,0,0,0.1)'
          }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => setIsEditing(true)}
              startIcon={<EditIcon />}
              sx={{ mr: 1, borderRadius: 2, px: 2 }}
            >
              Edytuj recepturę
            </Button>
            <Button 
              variant="outlined" 
              color="error"
              onClick={handleDeleteClick}
              startIcon={<DeleteIcon />}
              sx={{ borderRadius: 2, px: 2 }}
            >
              Usuń recepturę
            </Button>
          </CardActions>
        )}
      </Card>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>
          Potwierdzenie usunięcia
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz usunąć recepturę "{receptura?.nazwa}"?
            Tej operacji nie można cofnąć.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Anuluj</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SzczegolyReceptury;
