import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { db } from '../../firebase';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ReviewDetailsPage() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      setLoading(true);
      setError(null);
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
        setLoading(false);
      }
    };
    fetchReview();
  }, [id]);

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
    <Container maxWidth="md">
      
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h4" gutterBottom>{review.beerName}</Typography>
      <Typography variant="body1">Browar: {review.brewery}</Typography>
    </Paper>
    <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}>
        Wstecz
      </Button>
  </Container>
  );
}

export default ReviewDetailsPage;