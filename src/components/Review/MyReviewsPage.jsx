import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import { auth, db } from "../../firebase";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

function MyReviewsPage() {

  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
  }, [user]);

  const displayIcon = (icon) => {
    switch (icon) {
      case 'heart':
        return '❤️';
      case 'star':
        return '⭐';
      case 'thumbUp':
        return '👍';
      case 'thumbDown':
        return '👎';
      default:
        return null;
    }
  };

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
        photoUrl: doc.data().photoUrl || null,
      }));
      console.log("fetchedReviews:", fetchedReviews);
      setReviews(fetchedReviews);
    } catch (err) {
      setError("Wystąpił błąd podczas pobierania ocen.");
      console.error("Błąd pobierania recenzji:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "reviews", id));
      setReviews(reviews.filter((review) => review.id !== id));
      console.log("Recenzja usunięta pomyślnie.");
    } catch (error) {

      console.error("Błąd podczas usuwania recenzji:", error);
      setError("Wystąpił błąd podczas usuwania recenzji.");
    }
    handleClose();
  };
  const handleClickOpen = (reviewId) => {
    setReviewToDelete(reviewId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setReviewToDelete(null);
  };

  const handleCancelDelete = () => {
    handleClose();
  };

  const handleConfirmDelete = async () => {
    await handleDelete(reviewToDelete);

  };

  const goBack = () => {
    navigate("/");
  };
  useEffect(() => {
    getReviews();
  }, [user]);


  


  return (
    <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", mt: 2 }}>
    <h1>Moje Oceny</h1>
    {error && <p>{error}</p>}
    <Grid container spacing={2} sx={{ width: "100%", justifyContent: "center" }}>
      {reviews.map((review) => (
        <Grid item xs={12} sm={6} md={6} key={review.id} sx={{ display: "flex", justifyContent: "center" }}>
          <Paper elevation={3} sx={{ my: 1, p: 1, width: "90%", maxWidth: "400px" }}>
            <ListItem disableGutters sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ flexGrow: 1 }}>
                <Link to={`/review/${review.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <ListItemText
                    primary={
                      <Box display="flex" flexDirection="column">
                        <Typography variant="h6" component="div">
                          {review.beerName}
                        </Typography>
                        <Typography variant="body2">{review.breweryName}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mt: 0.5, mb: 0.5 }}>
                          <Rating
                            name="overallRating"
                            value={Number(review.overallRating) / 2 || 0}
                            readOnly
                            precision={0.5}
                            max={5}
                            emptyIcon={<StarBorderIcon />}
                            icon={<StarIcon style={{ color: "orange" }} />}
                          />
                          {displayIcon(review.icon)}
                          <Typography variant="body2" color="text.primary">
                            Styl: {review.style}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Link>
              </Box>
            </ListItem>
            {review.photoUrl && (
              <img src={review.photoUrl} alt={review.beerName} style={{ width: "100%", height: "auto", marginTop: "10px" }} />
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogActions>
        <Button onClick={handleCancelDelete}>Anuluj</Button>
        <Button onClick={handleConfirmDelete} autoFocus>Usuń</Button>
      </DialogActions>
    </Dialog>
    <Button variant="contained" color="secondary" onClick={goBack} sx={{ mb: 2 }}>
      Wróć
    </Button>
  </Container>
  );
}

export default MyReviewsPage;
