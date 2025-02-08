import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link, useNavigate} from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import { db, auth } from "../../firebase";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';

import Typography from '@mui/material/Typography';
function MyReviewsPage() {
  
  const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("user.uid:", user?.uid);
  },[user])


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const getReviews = async () => {
    if (!user) {
        setError("Użytkownik nie jest zalogowany.");
      return;
    }
    setError(null)
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, where("userId", "==", user.uid));
    try {
      const querySnapshot = await getDocs(q);
      const fetchedReviews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("fetchedReviews:", fetchedReviews);
      setReviews(fetchedReviews);
    } catch (err) {
      setError("Wystąpił błąd podczas pobierania ocen.");
      console.error("Błąd pobierania recenzji:", err);
    }
  };
  const deleteReview = async (reviewId) => {
    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      setReviews(reviews.filter((review) => review.id !== reviewId));
      console.log("Recenzja usunięta pomyślnie.");
    } catch (error) {
      console.error("Błąd podczas usuwania recenzji:", error);
      setError("Wystąpił błąd podczas usuwania recenzji.");
    }
  };

    const goBack = () => {
    navigate("/");
  };
  useEffect(() => {
    getReviews();
  }, [user]);

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', mt: 2 }}>

      <h1>Moje Oceny</h1>
      {error && <p>{error}</p>}
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {reviews.map((review) => (
            <Paper key={review.id} elevation={3} sx={{ my: 1, p: 1, width:'100%'}}>
              <ListItem disableGutters>
                <Link to={`/review/${review.id}`}>
                  <ListItemText
                  primary={
                    <Typography variant="h6" component="div">
                      {review.beerName}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'block' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                       Styl: {review.style}
                      </Typography>
                      <Typography variant="caption">Data: {review.tastingDate}</Typography>
                    </React.Fragment>}/>
                </Link>
                  <IconButton aria-label="delete" onClick={() => deleteReview(review.id)}>
                    <DeleteIcon />
                  </IconButton>


                </ListItem>
            </Paper>
        ))}
      </List>

      <Button
        variant="contained"
        color="secondary"
        startIcon={"<"}
        onClick={goBack}
        sx={{ mb: 2 }}
      >
        Wróć
      </Button>
    </Container>
  );
}

export default MyReviewsPage;
