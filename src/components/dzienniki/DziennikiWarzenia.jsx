import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import {
  Button,
  Grid,
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Paper,
  Divider,
  styled,
  Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import CategoryIcon from '@mui/icons-material/Category';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import GrassIcon from '@mui/icons-material/Grass';
import OpacityIcon from '@mui/icons-material/Opacity';
import { db, auth } from '../../firebase';

// Styled components to match the recipes
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  }
}));

const WarkaAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

function DziennikiWarzenia() {
  const [dzienniki, setDzienniki] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDiaryId, setDeleteDiaryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const navigate = useNavigate();

  const tiles = [
    {
      id: 'historia-warzenia',
      title: 'Historia warzenia',
      path: '/historia-warzenia'
    }
  ];

  useEffect(() => {
    const fetchDzienniki = async () => {
      setLoading(true)
      if (!auth.currentUser) {
          setLoading(false);
        return;
      }
      try {
        const userId = auth.currentUser.uid;
        const dziennikiCollection = collection(db, 'dziennikiWarzenia');
        const q = query(dziennikiCollection, where('userId', '==', userId));
        const dziennikiSnapshot = await getDocs(q);
        const dziennikiList = dziennikiSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDzienniki(dziennikiList);
      } finally {
        setLoading(false);
        }
    };
    fetchDzienniki();
  }, []);

  const handleDiaryClick = (id) => {
      navigate(`/dzienniki/warzenia/${id}`);
  }

  const handleDeleteClick = (id, event) => {
    event.stopPropagation();
    setDeleteDiaryId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteDiaryId(null);
  };

  const confirmDelete = async () => {
    if (deleteDiaryId) {
      try {
        await deleteDoc(doc(db, 'dziennikiWarzenia', deleteDiaryId));
        setDzienniki(dzienniki.filter((dziennik) => dziennik.id !== deleteDiaryId));
        setSnackbar({
          open: true,
          message: 'Dziennik warzenia został usunięty',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error deleting diary: ', error);
        setSnackbar({
          open: true,
          message: 'Błąd podczas usuwania dziennika',
          severity: 'error'
        });
      } finally {
        setDeleteDiaryId(null);
        setOpenDialog(false);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({...snackbar, open: false});
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Nie określono';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <Box>
      <Box mb={2}>
        <Typography variant="h4" component="h1">Dzienniki Warzenia</Typography>
      </Box>
      
      <Box mb={3}>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />} 
          component={Link} 
          to="/dzienniki/warzenia/add"
          sx={{ borderRadius: 2 }}
        >
          Dodaj nowy dziennik
        </Button>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, sm: 4, md: 5 },
          mb: { xs: 4, md: 5 },
          borderRadius: 3, 
          backgroundColor: '#f8f9fa',
          backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.9))',
          maxWidth: { xl: '80%', lg: '90%', md: '95%', sm: '100%' },
          mx: 'auto'
        }}
      >
        {dzienniki.length > 0 ? (
          <Grid container spacing={3}>
            {dzienniki.map((dziennik) => (
              <Grid item key={dziennik.id} xs={12} sm={12} md={12} lg={4} xl={3}>
                <StyledCard elevation={3} sx={{ minHeight: '300px' }}>
                  <CardHeader
                    avatar={
                      <WarkaAvatar sx={{ width: 56, height: 56, fontSize: '1.8rem' }}>
                        {(dziennik.nazwaWarki?.charAt(0) || 'W').toUpperCase()}
                      </WarkaAvatar>
                    }
                    title={
                      <Typography variant="h6" 
                        sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '90%',
                          fontSize: '1.25rem'
                        }}
                      >
                        {dziennik.nazwaWarki || "Warka bez nazwy"}
                      </Typography>
                    }
                    subheader={`Dodano: ${formatDate(dziennik.dataNastawienia)}`}
                    sx={{
                      pb: 1,
                      '& .MuiCardHeader-content': {
                        overflow: 'hidden'
                      }
                    }}
                    action={
                      <IconButton 
                        aria-label="usuń" 
                        onClick={(e) => handleDeleteClick(dziennik.id, e)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    }
                  />
                  <Divider />
                  <CardContent 
                    sx={{ 
                      flexGrow: 1,
                      pt: 2,
                      pb: 1,
                      px: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '150px'
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      overflow: 'hidden'
                    }}>
                      <CategoryIcon color="primary" fontSize="medium" sx={{ mr: 1.5, flexShrink: 0 }} />
                      <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: '1.05rem'
                        }}
                      >
                        {dziennik.rodzajPiwa || "Nie określono"}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      overflow: 'hidden'
                    }}>
                      <BubbleChartIcon color="secondary" fontSize="medium" sx={{ mr: 1.5, flexShrink: 0 }} />
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: '1rem'
                        }}
                      >
                        {dziennik.drozdze || "Nie określono"}
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mb: 2,
                      overflow: 'hidden'
                    }}>
                      <GrassIcon color="success" fontSize="medium" sx={{ mr: 1.5, flexShrink: 0 }} />
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: '1rem'
                        }}
                      >
                        {dziennik.chmiele || "Nie określono"}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ 
                    p: 2.5,
                    borderTop: '1px solid rgba(0,0,0,0.08)',
                    bgcolor: 'rgba(0,0,0,0.02)',
                  }}>
                    <Button
                      variant="contained"
                      size="medium"
                      onClick={() => handleDiaryClick(dziennik.id)}
                      sx={{ width: '100%' }}
                    >
                      Pokaż szczegóły
                    </Button>
                  </CardActions>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'rgba(0,0,0,0.02)',
              borderRadius: 2,
              border: '1px dashed rgba(0,0,0,0.2)'
            }}
          >
            <LocalDrinkIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.6 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Nie masz jeszcze żadnych dzienników warzenia
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
              Możesz utworzyć nowy dziennik warzenia, aby śledzić proces produkcji piwa
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={Link}
              to="/dzienniki/warzenia/add"
              sx={{ px: 3, py: 1, borderRadius: 2 }}
            >
              Utwórz pierwszy dziennik warzenia
            </Button>
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>
          Potwierdzenie usunięcia
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz usunąć ten dziennik warzenia?
            Tej operacji nie można cofnąć.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Anuluj</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Usuń
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Button component={Link} to="/dzienniki" variant="contained" color="primary" sx={{ mt: 2 }}>
        Powrót
      </Button>
    </Box>
  );
}

export default DziennikiWarzenia;