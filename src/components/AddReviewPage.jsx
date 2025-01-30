jsx
jsx
import { useState } from 'react';import { TextField, Button, Container, Typography, Box, Checkbox, FormControlLabel, Slider } from '@mui/material';
import { addDoc, collection, Timestamp, getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const AddReviewPage = () => {
  const [beerName, setBeerName] = useState('');
  const [brewery, setBrewery] = useState('');
  const [style, setStyle] = useState('');
  const [tastingDate, setTastingDate] = useState('');
  const [aromaIntensity, setAromaIntensity] = useState(3);
  const [aromaQuality, setAromaQuality] = useState(3);
  const [aromaNotes, setAromaNotes] = useState({
    fruity: false,
    floral: false,
    hoppy: false,
    malty: false,
  });
  const [color, setColor] = useState('');
  const [clarity, setClarity] = useState('');
  const [foam, setFoam] = useState('brak');
  const [tasteIntensity, setTasteIntensity] = useState(3);
  const [tasteBalance, setTasteBalance] = useState(3);
  const [bitterness, setBitterness] = useState(3);
  const [sweetness, setSweetness] = useState(3);
  const [acidity, setAcidity] = useState(3);
  const [tasteNotes, setTasteNotes] = useState('');
  const [overallImpression, setOverallImpression] = useState('brak');
  const [drinkability, setDrinkability] = useState('');
  const [complexity, setComplexity] = useState('');
  const [comments, setComments] = useState('');
  const [overallRating, setOverallRating] = useState(5);
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const db = getFirestore();
    const storage = getStorage();

    if (!auth.currentUser) {
      console.error("Użytkownik nie jest zalogowany");
      return;
    }

    const userId = auth.currentUser.uid;
    const now = Timestamp.now();

    let uploadedPhotoUrl = null;
    try {
      if (photo) {
            try {
                const storageRef = ref(storage, `photos/${photo.name}`);
                const uploadResult = await uploadBytes(storageRef, photo);
                uploadedPhotoUrl = await getDownloadURL(uploadResult.ref);
              }
                catch (error) {
                  console.error("Błąd podczas wysyłania zdjęcia:", error);
                  return;
                }

      }

      const newReview = {
        beerName,
        brewery,
        style,
        tastingDate,
        aromaIntensity,
        aromaQuality,
        aromaNotes,
        color,
        clarity,
        foam,
        tasteIntensity,
        tasteBalance,
        bitterness,
        sweetness,
        acidity,
        tasteNotes,
        overallImpression,
        drinkability,
        complexity,
        comments,
        overallRating,
        photoUrl: uploadedPhotoUrl,
        timestamp: now,
        userId,
      };


      const docRef = await addDoc(collection(db, 'reviews'), newReview);
      console.log("Document written with ID: ", docRef.id);

      setBeerName('');
      setBrewery('');
      setStyle('');
      setTastingDate('');
      setAromaIntensity(3);
      setAromaQuality(3);
      setAromaNotes({ fruity: false, floral: false, hoppy: false, malty: false });
      setColor('');
      setClarity('');
      setFoam('brak');
      setTasteIntensity(3);
      setTasteBalance(3);
      setBitterness(3);
      setSweetness(3);
      setAcidity(3);
      setTasteNotes('');
      setOverallImpression('brak');
      setDrinkability('');
      setComplexity('');
      setComments('');
      setOverallRating(5);
      setPhoto(null);
      setPhotoUrl(null);

    } catch (e) {
      console.error("Error adding document: ", e);
        }
  }

  return (
    <Container>
      <Typography variant="h4">Dodaj nową ocenę piwa</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Nazwa piwa"
          value={beerName}
          onChange={(e) => setBeerName(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Browar"
          value={brewery}
          onChange={(e) => setBrewery(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Styl"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          type="date"
          label="Data degustacji"
          value={tastingDate}
          onChange={(e) => setTastingDate(e.target.value)}
        />
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Intensywność aromatu</Typography>
                <Slider
                  aria-label="Intensywność aromatu"
                  value={aromaIntensity}
                  defaultValue={3}
                  step={1}
                  marks
                  min={1}
                  max={5}
                  valueLabelDisplay="auto"
                  onChange={(e, value) => setAromaIntensity(value)}
                />
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Jakość aromatu</Typography>
                <Slider
                  aria-label="Jakość aromatu"
                  value={aromaQuality}
                  defaultValue={3}
                  step={1}
                  marks
                  min={1}
                  max={5}
                  valueLabelDisplay="auto"
                  onChange={(e, value) => setAromaQuality(value)}
                />
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Nuty aromatyczne</Typography>
                <FormControlLabel
                  control={<Checkbox checked={aromaNotes.fruity} onChange={(e) => setAromaNotes({ ...aromaNotes, fruity: e.target.checked })} />}
                  label="Owocowe"
                />
                <FormControlLabel
                  control={<Checkbox checked={aromaNotes.floral} onChange={(e) => setAromaNotes({ ...aromaNotes, floral: e.target.checked })} />}
                  label="Kwiatowe"
                />
                <FormControlLabel
                  control={<Checkbox checked={aromaNotes.hoppy} onChange={(e) => setAromaNotes({ ...aromaNotes, hoppy: e.target.checked })} />}
                  label="Chmielowe"
                />
                <FormControlLabel
                  control={<Checkbox checked={aromaNotes.malty} onChange={(e) => setAromaNotes({ ...aromaNotes, malty: e.target.checked })} />}
                  label="Słodowe"
                />


                <TextField
                  fullWidth
                  margin="normal"
                  label="Barwa"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Klarowność"
                  value={clarity}
                  onChange={(e) => setClarity(e.target.value)}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Piana"
                  value={foam}
                  onChange={(e) => setFoam(e.target.value)}
                />
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Intensywność smaku</Typography>
                <Slider
                  aria-label="Intensywność smaku"
                  value={tasteIntensity}
                  defaultValue={3}
                  step={1}
                  marks
                  min={1}
                  max={5}
                  valueLabelDisplay="auto"
                  onChange={(e, value) => setTasteIntensity(value)}
                />
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Równowaga smaku</Typography>
                <Slider
                  aria-label="Równowaga smaku"
                  value={tasteBalance}
                  defaultValue={3}
                  step={1}
                  marks
                  min={1}
                  max={5}
                  valueLabelDisplay="auto"
                  onChange={(e, value) => setTasteBalance(value)}
                />
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Goryczka</Typography>
                <Slider
                  aria-label="Goryczka"
                  value={bitterness}
                  defaultValue={3}
                  step={1}
                  marks
                  min={1}
                  max={5}
                  valueLabelDisplay="auto"
                  onChange={(e, value) => setBitterness(value)}
                />
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Słodycz</Typography>
                <Slider
                  aria-label="Słodycz"
                  value={sweetness}
                  defaultValue={3}
                  step={1}
                  marks
                  min={1}
                  max={5}
                  valueLabelDisplay="auto"
                  onChange={(e, value) => setSweetness(value)}
                />
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Kwasowość</Typography>
                <Slider
                  aria-label="Kwasowość"
                  value={acidity}
                  defaultValue={3}
                  step={1}
                  marks
                  min={1}
                  max={5}
                  valueLabelDisplay="auto"
                  onChange={(e, value) => setAcidity(value)}
                />
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Ogólna ocena</Typography>
                <Slider
                      aria-label="Ogólna ocena"
                      value={overallRating}
                      defaultValue={3}
                      step={1}
                      marks
                      min={1}
                      max={10}
                      onChange={(e, value) => setOverallRating(value)}
                      />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Nuty smakowe"
                  value={tasteNotes}
                  onChange={(e) => setTasteNotes(e.target.value)}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Ogólne wrażenia"
                  value={overallImpression}
                  onChange={(e) => setOverallImpression(e.target.value)}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Pijalność"
                  value={drinkability}
                  onChange={(e) => setDrinkability(e.target.value)}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Złożoność"
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value)}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Uwagi"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />

                <input type="file" onChange={handlePhoto} />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Dodaj ocenę
        </Button>
      </Box>
    </Container>
  );
};

export default AddReviewPage;