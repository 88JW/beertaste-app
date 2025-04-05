import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Grid, Card, CardContent, CardActions,
  Button, Box, Divider, CardHeader, Paper, Avatar
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
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

const WarkaAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.warning.main,
  color: theme.palette.warning.contrastText,
}));

function HistoriaWarzenia() {
  const [archiwumWarek, setArchiwumWarek] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    
    const fetchArchiwumWarek = async () => {
      try {
        const userId = auth.currentUser?.uid;
        console.log("Current user ID:", userId);
        
        if (!userId) {
          console.log("No user ID found, redirecting to login");
          if (isMounted) navigate('/login');
          return;
        }

        console.log("Attempting to fetch archived brews for user:", userId);
        const q = query(collection(db, 'archiwumWarzenia'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        console.log("Query returned", querySnapshot.size, "archived brews");
        
        if (!isMounted) return;
        
        const archiwumList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data
          };
        });

        console.log("Final archived brews list:", archiwumList);
        setArchiwumWarek(archiwumList);
      } catch (error) {
        console.error('Error fetching archived brews:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (auth.currentUser) {
      fetchArchiwumWarek();
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!isMounted) return;
      
      if (user) {
        fetchArchiwumWarek();
      } else {
        navigate('/login');
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [navigate]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Brak daty';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div>Ładowanie historii warzenia...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIosNewIcon />}
        onClick={() => navigate("/dzienniki")}
        sx={{ mb: 2 }}
      >
        Powrót do dzienników
      </Button>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 3, 
          backgroundColor: '#f8f9fa',
          backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.9))',
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
            Historia Warzenia
          </Typography>
        </Box>

        {archiwumWarek.length > 0 ? (
          <Grid container spacing={3}>
            {archiwumWarek.map((warka) => (
              <Grid item key={warka.id} xs={12} sm={12} md={6} lg={6}>
                <StyledCard elevation={3} sx={{ minHeight: '280px' }}>
                  <CardHeader
                    avatar={
                      <WarkaAvatar sx={{ width: 56, height: 56, fontSize: '1.8rem' }}>
                        {(warka.nazwaWarki?.charAt(0) || 'W').toUpperCase()}
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
                        {warka.nazwaWarki || "Warka bez nazwy"}
                      </Typography>
                    }
                    subheader={`Zarchiwizowano: ${formatDate(warka.archiwizowano)} (Data nastawienia: ${formatDate(warka.dataNastawienia)})`}
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
                      height: '150px'
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
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
                          fontSize: '1.05rem'
                        }}
                      >
                        {warka.rodzajPiwa || "Nie określono"}
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
                      component={Link}
                      to={`/dzienniki/warzenia/${warka.warkaId}`}
                      sx={{ width: '100%' }}
                    >
                      Pokaż oryginał
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
              Brak zarchiwizowanych warek
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
              Aby dodać warkę do historii, przejdź do szczegółów warki i kliknij przycisk "Archiwizuj warkę"
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/dzienniki/warzenia')}
              sx={{ px: 3, py: 1, borderRadius: 2 }}
            >
              Przejdź do dzienników warzenia
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default HistoriaWarzenia;
