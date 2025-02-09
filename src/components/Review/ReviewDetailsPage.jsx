import React, { useState, useEffect } from 'react';
import { useParams, useNavigate,  } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,

  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ReviewDetailsPage() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [IconComponent, setIconComponent] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchReview = async () => {
      setLoading(true); // Set loading to true when starting to fetch data
      setError(null); // Clear any previous errors
      try {
        const reviewRef = doc(db, 'reviews', id);
        const docSnap = await getDoc(reviewRef);
        if (docSnap.exists()) {
          setReview(docSnap.data());
        } else {
          setError('Nie znaleziono recenzji.');
        }
      } catch (err) {
        setError('Wystąpił błąd podczas pobierania recenzji.');
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false when data fetching is completed
      }
    };
    fetchReview();
  }, [id]);

  const loadIcon = async (iconName) => {
    try {
      const { default: Icon } = await import(`@mui/icons-material/${iconName}`);
      setIconComponent(Icon);
    } catch (err) {
      console.error('Error importing icon:', err);
    }
  };
  useEffect(() => {
    if (review?.selectedIcon) {
      loadIcon(review.selectedIcon);
    }
  }, [review?.selectedIcon]);
  const renderIcon = () => {
    if (IconComponent) {
      const Icon = IconComponent;
      return <Icon />;
    }
    return null;
  };

  if (loading) {
    return <div>Ładowanie...</div>;
  }
  if (error) {
    return <div>Błąd: {error}</div>;
  }
  if (!review) {
    return <div>Nie znaleziono recenzji.</div>;
  }
  


  return (
    <Box
      sx={{
        
        maxWidth: 'md',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'}} >
      <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
        {/* Main container for all the review details */}
        <Stack spacing={2} >
          {/* Display basic information about the beer */}
          <Typography variant="h4" gutterBottom sx={{textAlign:'center'}}>
             {review.beerName}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Browar: {review.brewery}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Styl: {review.style}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Data degustacji: {review.tastingDate}
          </Typography>
          {/* Display aroma ratings */}
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Intensywność aromatu: {review.aromaIntensity}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Jakość aromatu: {review.aromaQuality}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body1" gutterBottom>
              Nuty aromatyczne: {review.aromaNotes}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body1" gutterBottom>
              Kolor: {review.color}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Klarowność: {review.clarity}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Piana: {review.foam}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Intensywność smaku: {review.tasteIntensity}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Balans smaku: {review.tasteBalance}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Goryczka: {review.bitterness}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Słodycz: {review.sweetness}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Kwasowość: {review.acidity}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body1" gutterBottom>
              Nuty smakowe: {review.tasteNotes}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Pijalność: {review.drinkability}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Złożoność: {review.complexity}</Typography>
          </Box>
          {/* Display overall rating */}
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Ocena ogólna (1-10):</Typography>
            <Typography>{review.overallRating}</Typography>
          </Box>



          {/* Display description */}
          <Typography variant="body1" gutterBottom sx={{textAlign:'center'}}>
            {review.description}
          </Typography>

          {/* Display Icon */}

          <Box display="flex" alignItems="center">
            <Typography mr={1}>Ikona:</Typography>
            <Box>{renderIcon()}</Box>
          </Box>

          {/* Display Photo */}
          {review.photoUrl && (
            <img
              src={review.photoUrl}
              alt="Beer"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          )}
        </Stack>

        <Box sx={{ mt: 3 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 3, mr: 1 }}>
            Wstecz
          </Button>

          <Button onClick={() => navigate(`/edit-review/${id}`)} sx={{ mt: 3, mr: 1 }}> Edytuj</Button>
        </Box>

       </Paper>

    </Box>
  );
}

export default ReviewDetailsPage;