import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

function MyReviewsPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  const [filterIcon, setFilterIcon] = useState('');

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
  }, [user, sortOrder]);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleIconFilterChange = (event) => {
    setFilterIcon(event.target.value);
  };

  const filterReviewsByIcon = (reviews) => {
    if (!filterIcon) return reviews;
    return reviews.filter((review) => review.selectedIcon === filterIcon);
  };

  const sortReviews = (reviews) => {
    switch (sortOrder) {
      case 'newest':
        return reviews.sort((a, b) => new Date(b.tastingDate) - new Date(a.tastingDate));
      case 'oldest':
        return reviews.sort((a, b) => new Date(a.tastingDate) - new Date(b.tastingDate));
      case 'highestRating':
        return reviews.sort((a, b) => b.overallRating - a.overallRating);
      case 'lowestRating':
        return reviews.sort((a, b) => a.overallRating - b.overallRating);
      default:
        return reviews;
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", mt: 2 }}>
      <h1>Moje Oceny</h1>
      {error && <p>{error}</p>}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <Box>
          <InputLabel>Sortuj według</InputLabel>
          <Select value={sortOrder} onChange={handleSortChange}>
            <MenuItem value="newest">Od najnowszej</MenuItem>
            <MenuItem value="oldest">Od najstarszej</MenuItem>
            <MenuItem value="highestRating">Od najwyższej oceny</MenuItem>
            <MenuItem value="lowestRating">Od najniższej oceny</MenuItem>
          </Select>
        </Box>
        <Box>
          <InputLabel>Filtruj według ikony</InputLabel>
          <Select value={filterIcon} onChange={handleIconFilterChange}>
            <MenuItem value="">Wszystkie</MenuItem>
            <MenuItem value="heart">❤️ Serce</MenuItem>
            <MenuItem value="star">⭐ Gwiazda</MenuItem>
            <MenuItem value="thumbUp">👍 Kciuk w górę</MenuItem>
            <MenuItem value="thumbDown">👎 Kciuk w dół</MenuItem>
          </Select>
        </Box>
      </Box>
      <Grid container spacing={2} sx={{ width: "100%", justifyContent: "center" }}>
        {sortReviews(filterReviewsByIcon(reviews)).map((review) => (
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
                          <Box display="flex" alignItems="center">
                            <Typography mr={1}>Ikona:</Typography>
                            <Box>{displayIcon(review.selectedIcon)}</Box>
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
