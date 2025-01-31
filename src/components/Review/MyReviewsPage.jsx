import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { Link, useNavigate} from "react-router-dom";
import { db, auth } from "../../firebase";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
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

    const goBack = () => {
    navigate("/");
  };
  useEffect(() => {
    getReviews();
  }, [user]);

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>

      <h1>Moje Oceny</h1>
      {error && <p>{error}</p>}
      <ul>
        {reviews.map((review) => (<li key={review.id}><Link to={`/review/${review.id}`}>{review.beerName}</Link></li>
        ))}
      </ul>
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