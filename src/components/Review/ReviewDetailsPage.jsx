import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  Container,
  Typography,
  Paper,
  Button,
  Rating,
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

  /**
   * Fetches review data from Firestore.
   */
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
    /**
   * Converts the 1-10 rating scale to 1-5 for display.
   */
  const scaledOverallRating = review.overallRating ? Math.round(review.overallRating / 2) : 0;
  return (
    <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      p: 2, // Padding for smaller devices
      width:'100%'
    }}
  >
       <Paper elevation={3} sx={{ p: 3,  width: '100%',
          maxWidth: 'md',}}>
        {/* Main container for all the review details */}
        <Stack spacing={2}>
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
            <Typography>Intensywność aromatu:</Typography>
            <Rating
              name="read-only"
              value={parseInt(review.aromaIntensity, 10)}
              readOnly
            />
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Jakość aromatu:</Typography>
            <Rating
              name="read-only"
              value={parseInt(review.aromaQuality, 10)}
              readOnly
            />
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
          {/* Display clarity rating */}
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Klarowność:</Typography>
            <Rating
              name="read-only"
              value={parseInt(review.clarity, 10)}
              readOnly
            />
          </Box>
          {/* Display foam rating */}
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Piana:</Typography>
            <Rating name="read-only" value={parseInt(review.foam, 10)} readOnly />
          </Box>
          {/* Display taste intensity rating */}
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Intensywność smaku:</Typography>
            <Rating
              name="read-only"
              value={parseInt(review.tasteIntensity, 10)}
              readOnly
            />
          </Box>
          {/* Display taste balance rating */}
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Balans smaku:</Typography>
            <Rating
              name="read-only"
              value={parseInt(review.tasteBalance, 10)}
              readOnly
            />
          </Box>
          {/* Display bitterness rating */}
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Goryczka:</Typography>
            <Rating
              name="read-only"
              value={parseInt(review.bitterness, 10)}
              readOnly
            />
          </Box>
          {/* Display sweetness rating */}
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Słodycz:</Typography>
            <Rating
              name="read-only"
              value={parseInt(review.sweetness, 10)}
              readOnly
            />
          </Box>
          {/* Display acidity rating */}
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Kwasowość:</Typography>
            <Rating
              name="read-only"
              value={parseInt(review.acidity, 10)}
              readOnly
            />
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body1" gutterBottom>
            Nuty smakowe: {review.tasteNotes}
          </Typography>
          </Box>
          {/* Display drinkability rating */}
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Pijalność:</Typography>
            <Rating
              name="read-only"
              value={parseInt(review.drinkability, 10)}
              readOnly
            />
          </Box>
          {/* Display complexity rating */}
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Złożoność:</Typography>
            <Rating
              name="read-only"
              value={parseInt(review.complexity, 10)}
              readOnly
            />
          </Box>
             {/* Display overall rating */}
           <Box display="flex" alignItems="center" gap={1}>
            <Typography>Ocena ogólna:</Typography>
            <Rating
              name="read-only"
              value={scaledOverallRating}
              readOnly
            />
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
         {/* Button to go back to the previous page */}

      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 3 }}>
        Wstecz
      </Button>
       </Paper>

    </Box>
  );
}

export default ReviewDetailsPage;