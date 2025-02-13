import { useState, useEffect, useRef } from 'react'; // <-- dodano useRef
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import * as material from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Rating from '@mui/material/Rating';
import ShareIcon from '@mui/icons-material/Share'; // <-- nowy import
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // <-- nowy import

function ReviewDetailsPage() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [fileToShare, setFileToShare] = useState(null); // <-- nowy stan
  const fileInputRef = useRef(null); // <-- referencja do inputa
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Dodaj nowy stan dla snackbara

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

  // Nowy useEffect do pobrania obrazu jako File, jeśli photoUrl jest dostępny
  useEffect(() => {
    if (review && review.photoUrl) {
      fetch(review.photoUrl)
        .then(response => response.blob())
        .then(blob => {
          const file = new File([blob], 'beer.jpg', { type: blob.type });
          setFileToShare(file);
        })
        .catch(err => console.error('Błąd pobierania obrazu:', err));
    }
  }, [review]);

  // Nowa funkcja obsługująca zmianę obrazu przez input
  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setFileToShare(selectedFile);
  };

  // Nowa funkcja udostępniania
  const handleShare = async () => {
    if (navigator.canShare && fileToShare && review) {
      const textToShare = `
Beer: ${review.beerName}
Browar: ${review.brewery}
Styl: ${review.style}
Data degustacji: ${review.tastingDate}
Ocena ogólna: ${review.overallRating}/10
Opis: ${review.description}
      `;
      const shareData = {
        title: `Recenzja piwa - ${review.beerName}`,
        text: textToShare,
        files: [fileToShare],
      };
      if (navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.error('Błąd podczas udostępniania:', err);
        }
      } else {
        console.error('Nie można udostępnić danych.');
      }
    } else {
      console.log('Web Share API nie jest obsługiwane lub brak obrazu do udostępnienia');
    }
  };

  // Nowa funkcja kopiowania treści recenzji
  const handleCopyText = () => {
    if (review) {
      const textToCopy = `
Beer: ${review.beerName}
Browar: ${review.brewery}
Styl: ${review.style}
Data degustacji: ${review.tastingDate}
Ocena ogólna: ${review.overallRating}/10
Opis: ${review.description}
      `;
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setSnackbarOpen(true);
        })
        .catch((err) => {
          console.error('Błąd podczas kopiowania tekstu:', err);
        });
    }
  };

  // Funkcja zamykająca Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

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

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'reviews', id));
      navigate('/');
    } catch (error) {
      console.error('Błąd podczas usuwania recenzji:', error);
      setError('Wystąpił błąd podczas usuwania recenzji.');
    }
    handleClose();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
    <material.Box
      sx={{ maxWidth: 'md', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }} >
      <material.Paper elevation={3} sx={{ p: 3, width: '100%' }}>
        {/* Main container for all the review details */}
        <material.Stack spacing={2} >
          {/* Display basic information about the beer */}
          <material.Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
            {review.beerName}
          </material.Typography>
          <material.Typography variant="subtitle1" gutterBottom>
            Browar: {review.brewery}
          </material.Typography>
          <material.Typography variant="body1" gutterBottom>
            Styl: {review.style}
          </material.Typography>
          <material.Typography variant="body1" gutterBottom>
            Data degustacji: {review.tastingDate}
          </material.Typography>
          {/* Display aroma ratings */}
          <material.Box display="flex" alignItems="center" gap={1} >
            <material.Typography>Intensywność aromatu:</material.Typography>
            <Rating name="read-only" value={parseInt(review.aromaIntensity)} max={5} readOnly precision={1} />
          </material.Box>
          <material.Box display="flex" alignItems="center" gap={1}>
            <material.Typography>Jakość aromatu:</material.Typography>
            <Rating name="read-only" value={parseInt(review.aromaQuality)} max={5} readOnly precision={1} />
          </material.Box>
          <material.Box display="flex" alignItems="center" gap={1}>
            <material.Typography variant="body1" gutterBottom>
              Nuty aromatyczne: {review.aromaNotes}
            </material.Typography>
          </material.Box>
          <material.Box display="flex" alignItems="center" gap={1}>
            <material.Typography variant="body1" gutterBottom>
              Kolor: {review.color}
            </material.Typography>
          </material.Box>
          <material.Box display="flex" alignItems="center" gap={1}>
            <material.Typography>Klarowność:</material.Typography>
            <Rating name="read-only" value={parseInt(review.clarity)} max={5} readOnly precision={1} />
          </material.Box>

          <material.Box display="flex" alignItems="center" gap={1}>
            <material.Typography>Piana:</material.Typography>
            <Rating name="read-only" value={parseInt(review.foam)} max={5} readOnly precision={1} />
          </material.Box>

          <material.Box display="flex" alignItems="center" gap={1}>
            <material.Typography>Intensywność smaku:</material.Typography>
            <Rating name="read-only" value={parseInt(review.tasteIntensity)} max={5} readOnly precision={1} />
          </material.Box>

          <material.Box display="flex" alignItems="center" gap={1}>
            <material.Typography>Balans smaku:</material.Typography>
            <Rating name="read-only" value={parseInt(review.tasteBalance)} max={5} readOnly precision={1} />
          </material.Box>

          <material.Box display="flex" alignItems="center" gap={1}>
            <material.Typography>Goryczka:</material.Typography>
            <Rating name="read-only" value={parseInt(review.bitterness)} max={5} readOnly precision={1} />
          </material.Box>

          <material.Box display="flex" alignItems="center" gap={1}>

          </material.Box>

          <material.Box display="flex" alignItems="center" gap={1}>
            <material.Typography>Słodycz:</material.Typography>
            <Rating name="read-only" value={review.sweetness} max={5} readOnly precision={1} />
          </material.Box>
          <material.Box display="flex" alignItems="center" gap={1}>
            <material.Typography>Kwasowość:</material.Typography>
            <Rating name="read-only" value={review.acidity} max={5} readOnly precision={1} />        </material.Box>

          <material.Box display="flex" alignItems="center" gap={1}>
            <material.Typography variant="body1" gutterBottom>
              Nuty smakowe: {review.tasteNotes}
            </material.Typography>
          </material.Box>

          <material.Box display="flex" alignItems="center" gap={1}>
            <material.Typography>Pijalność:</material.Typography>
            <Rating name="read-only" value={parseInt(review.drinkability)} max={5} readOnly precision={1} />
          </material.Box>

          <material.Box display="flex" alignItems="center" gap={1}>
            <material.Typography>Złożoność:</material.Typography>
            <Rating name="read-only" value={parseInt(review.complexity)} max={5} readOnly precision={1} />
          </material.Box>
          {/* Display overall rating */}
          <material.Box display="flex" alignItems="center" gap={1}>
            <material.Typography>Ocena ogólna:</material.Typography>
            <Rating name="read-only" value={parseInt(review.overallRating)} max={10} readOnly precision={1} />
          </material.Box>



          {/* Display description */}
          <material.Typography variant="body1" gutterBottom sx={{ textAlign: 'center' }}>
            {review.description}
          </material.Typography>

          {/* Display Icon */}

          <material.Box display="flex" alignItems="center">
            <material.Typography mr={1}>Ikona:</material.Typography>
            <material.Box>{review && renderIcon()}</material.Box>
          </material.Box>

          {/* Display Photo */}
          {review.photoUrl && (
            <img
              src={review.photoUrl}
              alt="Beer"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          )}
        </material.Stack>

        <material.Box sx={{ mt: 3 }}>
          <material.Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 3, mr: 1 }}>
            Wstecz
          </material.Button>

          <material.Button onClick={() => navigate(`/edit-review/${id}`)} sx={{ mt: 3, mr: 1 }}> Edytuj</material.Button>
          <material.Button onClick={handleShare} startIcon={<ShareIcon />} sx={{ mt: 3, mr: 1 }}>
            Udostępnij
          </material.Button>
          <material.Button onClick={handleCopyText} startIcon={<ContentCopyIcon />} sx={{ mt: 3, mr: 1 }}>
            Kopiuj
          </material.Button>
          <material.Button onClick={handleClickOpen} sx={{ mt: 3, mr: 1 }} color="error">Usuń</material.Button>
        </material.Box>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        <material.Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <material.DialogActions>
            <material.Button onClick={handleClose}>Anuluj</material.Button>
            <material.Button onClick={handleDelete} autoFocus>Usuń</material.Button>
          </material.DialogActions>
        </material.Dialog>
        <material.Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
          <material.Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Tekst został skopiowany do schowka!
          </material.Alert>
        </material.Snackbar>
      </material.Paper>

    </material.Box>
  );
}

export default ReviewDetailsPage;