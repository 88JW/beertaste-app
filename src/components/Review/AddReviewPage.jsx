import { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Slider, Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton, Stack, Input } from '@mui/material';
import { addDoc, collection, Timestamp, getFirestore } from 'firebase/firestore';
import { getAuth, } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AddReviewPage = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate("/");
  };
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
  const [tasteIntensity, setTasteIntensity] = useState(3);
 const [tasteBalance, setTasteBalance] = useState(3);
  const [bitterness, setBitterness] = useState(3); 
  const [sweetness, setSweetness] = useState(3);
  const [color, setColor] = useState('');

  const [acidity, setAcidity] = useState(3);
  const [tasteNotes, setTasteNotes] = useState('');
  const [comments, setComments] = useState('');
  const [overallRating, setOverallRating] = useState(5);

  const [aromaNotesText, setAromaNotesText] = useState('');
  const [foam, setFoam] = useState(3);
  const [clarity, setClarity] = useState(3);
  const [complexity, setComplexity] = useState(3);
  const [drinkability, setDrinkability] = useState(3);


  const [photoUrl, setPhotoUrl] = useState('');

  const [selectedIcon, setSelectedIcon] = useState(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getFirestore();
      const auth = getAuth();
      if (!auth.currentUser) {
      console.error("Użytkownik nie jest zalogowany");
      return;
    }


    const userId = auth.currentUser.uid;
    const now = Timestamp.now();


    try {
        const newReview = {
          beerName,
          brewery,
          style,
          tastingDate,
          aromaIntensity,
          aromaQuality,
          aromaNotes: aromaNotesText,
          color,
          clarity,
          foam,
          tasteIntensity,
          complexity,
          tasteBalance,
            bitterness,
            sweetness,
          acidity,
          tasteNotes,
          drinkability,
          overallRating,
          selectedIcon,
          photoUrl,
          timestamp: now,
            userId: userId,
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

       setAromaNotesText('');
      setColor('');
      setClarity(3);
      setFoam(3);
      setTasteIntensity(3);
      setDrinkability(3);
      setTasteBalance(3);
      setBitterness(3);
      setSweetness(3);
      setAcidity(3);
      setTasteNotes('');
      setComplexity(3);
      setOverallRating(3);
     
      setSelectedIcon(null);
      setPhotoUrl('');
    } catch (e) {
      console.error("Error adding document: ", e);
    } 
  };
    const handlePhoto = (e) => {
        // Get the selected file from the input
        const file = e.target.files[0];
        // Check if a file was selected
        if (file) {
            // Create a FileReader to read the file's content
            const reader = new FileReader();
            // Define what happens when the file is successfully loaded
            reader.onload = () => {
                // Create a new Image object
                const img = new Image();
                // Define what happens when the image is loaded
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 800;
                    canvas.height = (img.height * 800) / img.width;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const base64String = canvas.toDataURL('image/jpeg');
                    setPhotoUrl(base64String); // Update the photoUrl state with the base64 string
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file); // Start reading the file as a data URL
        }
    };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            <TextField
              fullWidth
              margin="normal"
              label="Dodatkowe noty aromatyczne"
            value={aromaNotesText}
            onChange={(e) => setAromaNotesText(e.target.value)}
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Kolor</Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="color-label">Kolor</InputLabel>
            <Select
              labelId="color-label"
              id="color-select"
              value={color}
              label="Kolor"
              onChange={(e) => setColor(e.target.value)}
            >
              <MenuItem value="Jasne">Jasne</MenuItem>
              <MenuItem value="Bursztynowe">Bursztynowe</MenuItem>
              <MenuItem value="Ciemne">Ciemne</MenuItem>
              <MenuItem value="Czarne">Czarne</MenuItem>
              <MenuItem value="inne">Inne</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Klarowność</Typography>
          <Slider
            aria-label="Klarowność"
            value={clarity}
            defaultValue={3}
            step={1}
            marks
            min={1}
            max={5}
            valueLabelDisplay="auto"
            onChange={(e, value) => setClarity(value)}
          />

          <Typography variant="subtitle1" sx={{ mt: 2 }}>Piana</Typography>
          <Slider
            aria-label="Piana"
            value={foam}
            defaultValue={3}
            step={1}
           marks
            min={1}
            max={5}
            valueLabelDisplay="auto"
            onChange={(e, value) => setFoam(value)}
          />
        <TextField
          fullWidth
          margin="normal"
          label="Nuty smakowe"
          value={tasteNotes}
          onChange={(e) => setTasteNotes(e.target.value)}
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

                  <Typography variant="subtitle1" sx={{ mt: 2 }}>Pijalność</Typography>
                  <Slider
                    aria-label="Pijalność"
                    value={drinkability}
                    defaultValue={3}
                    step={1}
                    marks
                    min={1}
                    max={5}
                    valueLabelDisplay="auto"
                    onChange={(e, value) => setDrinkability(value)}
                  />
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>Złożoność</Typography>
                  <Slider
                    aria-label="Złożoność"
                    value={complexity}
                    defaultValue={3}
                    step={1}
                    marks
                    min={1}
                    max={5}
                    valueLabelDisplay="auto"
                    onChange={(e, value) => setComplexity(value)}
                  />
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>Ogólna ocena</Typography>
                  <Slider
                        aria-label="Ogólna ocena"
                        value={overallRating}
                        defaultValue={5}
                        step={1}
                        marks
                        min={1}
                        max={10}
                        onChange={(e, value) => setOverallRating(value)}
                />    

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" align="center">
            Dodaj ikonę, aby wyrazić więcej
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Tooltip title="Ulubione">
                <IconButton
                  variant={selectedIcon === 'heart' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedIcon('heart')}
                  sx={{
                    color: selectedIcon === 'heart' ? 'red' : 'inherit',
                  }}
                >
                  ❤️
                </IconButton>
              </Tooltip>
              <Typography variant="caption" align="center">
                Ulubione
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Tooltip title="Specjalne">
                <IconButton
                  variant={selectedIcon === 'star' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedIcon('star')}
                  sx={{
                    color: selectedIcon === 'star' ? 'gold' : 'inherit',
                  }}
                >
                  ⭐
                </IconButton>
              </Tooltip>
              <Typography variant="caption" align="center">
                Specjalne
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Tooltip title="Polecane">
                <IconButton
                  variant={selectedIcon === 'thumbUp' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedIcon('thumbUp')}
                  sx={{
                    color: selectedIcon === 'thumbUp' ? 'green' : 'inherit',
                  }}
                >
                  👍
                </IconButton>
              </Tooltip>
              <Typography variant="caption" align="center">
                Polecam
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Tooltip title="Nie polecam">
                <IconButton variant={selectedIcon === 'thumbDown' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedIcon('thumbDown')}
                   sx={{
                    color: selectedIcon === 'thumbsDown' ? 'grey' : 'inherit',
                  }}
                >
                  👎
                </IconButton>
              </Tooltip>
              <Typography variant="caption" align="center">
                Nie polecam
              </Typography>
            </Box>
          </Box>
        </Box>

            {selectedIcon && (
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Wybrana ikona: {selectedIcon === 'heart' ? '❤️ Ulubione' : selectedIcon === 'star' ? '⭐ Specjalne' : selectedIcon === 'thumbUp' ? '👍 Polecam' : '👎 Nie polecam'}</Typography>
            )}

                <TextField
                  fullWidth
                  margin="normal"
                  label="Uwagi"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
        <TextField
          fullWidth
         margin="normal"
          label="Zdjęcie"
          value={photoUrl}
          disabled
        />
          {photoUrl && (
            <Box mt={2}>
               <img src={photoUrl} alt="Wybrane zdjęcie" style={{ maxWidth: '300px', maxHeight: '300px' }} />
            </Box>
          )}
          <Typography variant="subtitle1" sx={{ mt: 2 }} align="center">Wybierz zdjęcie</Typography>
          <Stack direction="row" spacing={2} mt={2} alignItems="center" justifyContent="center">
            <Button
              variant="contained"
              component="label" color="secondary" sx={{ bgcolor: "#2e2e2e" }}>
              <input
                accept="image/*" // Specify accepted file types
                type="file"
                onChange={handlePhoto}
                />
                </Button>
          <Button type="submit" variant="contained" color="primary" >
              Dodaj ocenę
          </Button>
          <Button variant="contained" sx={{ bgcolor: "#2e2e2e" }} onClick={goBack}>
            Wróć
          </Button>
          </Stack>
      </Box>
    </Container>
  );
};

export default AddReviewPage;