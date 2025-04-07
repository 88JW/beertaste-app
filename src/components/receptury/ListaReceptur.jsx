import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Grid, Card, CardContent, CardActions,
  Button, Box, Divider, IconButton, CardHeader, Paper, Chip,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Snackbar, Alert, Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import GrassIcon from '@mui/icons-material/Grass';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const RecipeAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

function ListaReceptur() {
  const [receptury, setReceptury] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recepturaToDelete, setRecepturaToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    let isMounted = true; // Add a mounted flag
    
    const fetchReceptury = async () => {
      try {
        const userId = auth.currentUser?.uid;
        console.log("Current user ID:", userId);
        
        if (!userId) {
          console.log("No user ID found, redirecting to login");
          if (isMounted) navigate('/login');
          return;
        }

        console.log("Attempting to fetch recipes for user:", userId);
        const q = query(collection(db, 'receptury'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        console.log("Query returned", querySnapshot.size, "recipes");
        
        if (!isMounted) return; // Check if still mounted before state update
        
        const recepturyList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log("Recipe data:", data);
          return {
            id: doc.id,
            ...data,
            // Make sure BLG has a default value if undefined
            blg: data.blg || 0
          };
        });

        console.log("Final recipes list:", recepturyList);
        setReceptury(recepturyList);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Fetch on component mount if user is already logged in
    if (auth.currentUser) {
      fetchReceptury();
    }

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!isMounted) return;
      
      if (user) {
        console.log("Auth state changed, user logged in:", user.uid);
        fetchReceptury();
      } else {
        console.log("Auth state changed, no user found");
        navigate('/login');
      }
    });

    // Clean up function
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []); // useEffect dependencies

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Brak daty';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const handleDeleteClick = (receptura, event) => {
    event.preventDefault(); // Prevent navigation to details page
    event.stopPropagation();
    setRecepturaToDelete(receptura);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setRecepturaToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!recepturaToDelete) return;
      
      await deleteDoc(doc(db, 'receptury', recepturaToDelete.id));
      
      // Update the UI by removing the deleted recipe
      setReceptury(receptury.filter(r => r.id !== recepturaToDelete.id));
      
      setSnackbar({
        open: true,
        message: 'Receptura została usunięta',
        severity: 'success'
      });
    } catch (error) {
      console.error('Błąd usuwania receptury:', error);
      setSnackbar({
        open: true,
        message: 'Błąd podczas usuwania receptury',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setRecepturaToDelete(null);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({...snackbar, open: false});
  };

  if (loading) {
    return <div>Ładowanie receptur...</div>;
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
      <Container 
        disableGutters
        maxWidth={false} 
        sx={{ 
          mt: 0, // Change from mt: 4 to mt: 0
          mb: 4,
          px: 0,
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto',
          boxSizing: 'border-box',
          pt: 1 // Add small top padding instead
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIosNewIcon />}
          onClick={() => navigate("/")}
          sx={{ mb: 2, ml: 3, mt: 1 }} // Add mt: 1 for a bit of spacing
        >
          Powrót do strony głównej
        </Button>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            borderRadius: 3, 
            backgroundColor: '#f8f9fa',
            backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.9))',
            width: '100%',  // Ensure paper takes full width
            boxSizing: 'border-box'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            borderBottom: '2px solid #e0e0e0',
            pb: 2 
          }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              color="primary"
              sx={{ 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center' 
              }}
            >
              <LocalDrinkIcon sx={{ mr: 1, fontSize: 35 }} /> 
              Twoje Receptury
            </Typography>
          </Box>

          {receptury.length > 0 ? (
            <Grid container spacing={3}>
              {receptury.map((receptura) => (
                <Grid item key={receptura.id} xs={12} sm={12} md={6} lg={6}>
                  <StyledCard elevation={3} sx={{ minHeight: '280px' }}>
                    <CardHeader
                      avatar={
                        <RecipeAvatar sx={{ width: 56, height: 56, fontSize: '1.8rem' }}>
                          {(receptura.nazwa?.charAt(0) || 'R').toUpperCase()}
                        </RecipeAvatar>
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
                          {receptura.nazwa || "Receptura bez nazwy"}
                        </Typography>
                      }
                      subheader={`Dodano: ${formatDate(receptura.dataDodania)}`}
                      sx={{
                        pb: 1,
                        '& .MuiCardHeader-content': {
                          overflow: 'hidden'
                        }
                      }}
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
                        height: '150px'  // Increased height for content area
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 2,  // Increased margin
                        overflow: 'hidden'
                      }}>
                        <LocalDrinkIcon color="primary" fontSize="medium" sx={{ mr: 1.5, flexShrink: 0 }} />
                        <Typography 
                          variant="body1" 
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '1.05rem'  // Slightly larger font
                          }}
                        >
                          {receptura.rodzajPiwa || "Nie określono"}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 2,  // Increased margin
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
                            fontSize: '1rem'  // Slightly larger font
                          }}
                        >
                          {receptura.drozdze || "Nie określono"}
                        </Typography>
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 2,  // Increased margin
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
                            fontSize: '1rem'  // Slightly larger font
                          }}
                        >
                          {receptura.chmiele || "Nie określono"}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ 
                      p: 2.5,  // Increased padding
                      borderTop: '1px solid rgba(0,0,0,0.08)',
                      bgcolor: 'rgba(0,0,0,0.02)',
                    }}>
                      <Button
                        variant="contained"
                        size="medium"  // Changed from small
                        startIcon={<VisibilityIcon />}
                        component={Link}
                        to={`/receptury/${receptura.id}`}
                        sx={{ width: '100%' }}  // Make button full width
                      >
                        Szczegóły
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
                Nie masz jeszcze żadnych receptur
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
                Możesz utworzyć nową recepturę lub zapisać istniejącą warkę jako recepturę
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                component={Link}
                to="/receptury/nowa"
                sx={{ px: 3, py: 1, borderRadius: 2 }}
              >
                Utwórz pierwszą recepturę
              </Button>
            </Box>
          )}
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
        >
          <DialogTitle>
            Potwierdzenie usunięcia
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Czy na pewno chcesz usunąć recepturę "{recepturaToDelete?.nazwa || 'Receptura bez nazwy'}"?
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
      </Container>
    </Box>
  );
}

export default ListaReceptur;
