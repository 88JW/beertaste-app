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
  Select,
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Rating from '@mui/material/Rating';



function ReviewDetailsPage() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
          setReview((prevReview) => ({
            ...prevReview,
            sweetness: parseInt(prevReview.sweetness, 10), // Change to number
            acidity: parseInt(prevReview.acidity, 10), // Change to number
          }));

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

  const renderIcon = () => {
    switch (review.selectedIcon) {
      case 'heart':
        return <span style={{ color: 'red', fontSize: '24px' }}>❤️</span>;
      case 'star':
        return <span style={{ color: 'gold', fontSize: '24px' }}>⭐</span>;
      case 'thumbUp':
        return <span style={{ color: 'green', fontSize: '24px' }}>👍</span>;
      case 'thumbDown':
        return <span style={{ color: 'gray', fontSize: '24px' }}>👎</span>;
      default:
        return null;
    }
  };

  if (loading) { return <div>Ładowanie...</div>; }
  if (!review) {
      return <div>Nie znaleziono recenzji.</div>;
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
          <Box display="flex" alignItems="center" gap={1} >
              <Typography>Intensywność aromatu:</Typography>
              <Rating name="read-only" value={parseInt(review.aromaIntensity)} max={5} readOnly precision={1} />
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography>Jakość aromatu:</Typography>
              <Rating name="read-only" value={parseInt(review.aromaQuality)} max={5} readOnly precision={1} />
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
              <Typography>Klarowność:</Typography>
              <Rating name="read-only" value={parseInt(review.clarity)} max={5} readOnly precision={1} />
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Typography>Piana:</Typography>
              <Rating name="read-only" value={parseInt(review.foam)} max={5} readOnly precision={1} />
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Typography>Intensywność smaku:</Typography>
              <Rating name="read-only" value={parseInt(review.tasteIntensity)} max={5} readOnly precision={1} />
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Typography>Balans smaku:</Typography>
              <Rating name="read-only" value={parseInt(review.tasteBalance)} max={5} readOnly precision={1} />
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Typography>Goryczka:</Typography>
              <Rating name="read-only" value={parseInt(review.bitterness)} max={5} readOnly precision={1} />
            </Box>

          <Box display="flex" alignItems="center" gap={1}>
            
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
          <Typography>Słodycz:</Typography>
          <Rating name="read-only" value={review.sweetness} max={5} readOnly precision={1} />
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography>Kwasowość:</Typography>
          <Rating name="read-only" value={review.acidity} max={5} readOnly precision={1} />        </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body1" gutterBottom>
              Nuty smakowe: {review.tasteNotes}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Pijalność:</Typography>
            <Rating name="read-only" value={parseInt(review.drinkability)} max={5} readOnly precision={1} />
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Złożoność:</Typography>
            <Rating name="read-only" value={parseInt(review.complexity)} max={5} readOnly precision={1} />
          </Box>
          {/* Display overall rating */}
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Ocena ogólna:</Typography>
            <Rating name="read-only" value={parseInt(review.overallRating)} max={10} readOnly precision={1} />
          </Box>
          


          {/* Display description */}
          <Typography variant="body1" gutterBottom sx={{textAlign:'center'}}>
            {review.description}
          </Typography>

          {/* Display Icon */}

          <Box display="flex" alignItems="center">
            <Typography mr={1}>Ikona:</Typography>
            <Box>{review && renderIcon()}</Box>
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