import { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Slider, Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton, Input } from '@mui/material';
import * as Icons from '@mui/icons-material';
import { doc, updateDoc, collection, Timestamp, getFirestore, getDoc } from 'firebase/firestore';
import { getAuth, } from 'firebase/auth';
import { useNavigate, useParams } from "react-router-dom";


const EditReviewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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

  const [tasteNotes, setTasteNotes] = useState('');
  const [comments, setComments] = useState('');
  const [overallRating, setOverallRating] = useState(5);

  const [aromaNotesText, setAromaNotesText] = useState('');
  const [foam, setFoam] = useState(3);
  const [clarity, setClarity] = useState(3);
    const [acidity, setAcidity] = useState(3);
  const [complexity, setComplexity] = useState(3);
  const [drinkability, setDrinkability] = useState(3);


  const [photoUrl, setPhotoUrl] = useState('');

  const [selectedIcon, setSelectedIcon] = useState(null); 
    useEffect(() => {
        const fetchReviewData = async () => {
            if (!id) return;
            const db = getFirestore();
            const docRef = doc(db, 'reviews', id);
            try {
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setBeerName(data.beerName);
                    setBrewery(data.brewery);
                    setStyle(data.style);
                    setTastingDate(data.tastingDate);
                    setAromaIntensity(data.aromaIntensity);
                    setAromaQuality(data.aromaQuality);
                    setAromaNotesText(data.aromaNotes);
                    setColor(data.color);
                    setClarity(data.clarity);
                    setFoam(data.foam);
                    setTasteIntensity(data.tasteIntensity);
                    setDrinkability(data.drinkability);
                    setTasteBalance(data.tasteBalance);
                    setBitterness(data.bitterness);
                    setSweetness(data.sweetness);
                    setAcidity(data.acidity);
                    setTasteNotes(data.tasteNotes);
                    setComplexity(data.complexity);
                    setOverallRating(data.overallRating);
                    setSelectedIcon(data.selectedIcon);
                    setPhotoUrl(data.photoUrl);

                }
            } catch (error) {
                console.error("Error fetching review data: ", error);
            }
        };
        fetchReviewData();
    }, [id]);

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

      const reviewRef = doc(db, 'reviews', id);

      try {
          await updateDoc(reviewRef, {
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
          });
          console.log("Document updated with ID: ", id);
          navigate(-1);
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
    <Container sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
        width: '100%', 
        maxWidth: 'md', 
        padding: {
          xs: 2,
          sm: 3,
          md: 4
      },
    }}
    >
      <Typography variant="h4">Edytuj ocenę piwa</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 , width: { xs: '100%', sm: '80%', md: '60%' } }}>
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
          sx={{
            '& .MuiSlider-thumb': {
              width: { xs: 12, sm: 15 },
              height: { xs: 12, sm: 15 },
            },
            '& .MuiSlider-track': {
              height: { xs: 4, sm: 6 },
            }
          }}
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
          sx={{
            '& .MuiSlider-thumb': {
              width: { xs: 12, sm: 15 },
              height: { xs: 12, sm: 15 },
            },
            '& .MuiSlider-track': {
              height: { xs: 4, sm: 6 },
            }
          }}
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
            sx={{
              '& .MuiSlider-thumb': {
                width: { xs: 12, sm: 15 },
                height: { xs: 12, sm: 15 },
              },
              '& .MuiSlider-track': {
                height: { xs: 4, sm: 6 },
              }
            }}
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
            sx={{
              '& .MuiSlider-thumb': {
                width: { xs: 12, sm: 15 },
                height: { xs: 12, sm: 15 },
              },
              '& .MuiSlider-track': {
                height: { xs: 4, sm: 6 },
              }
            }}
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
            sx={{
              '& .MuiSlider-thumb': {
                width: { xs: 12, sm: 15 },
                height: { xs: 12, sm: 15 },
              },
              '& .MuiSlider-track': {
                height: { xs: 4, sm: 6 },
              }
            }}
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
                  sx={{
                    '& .MuiSlider-thumb': {
                      width: { xs: 12, sm: 15 },
                      height: { xs: 12, sm: 15 },
                    },
                    '& .MuiSlider-track': {
                      height: { xs: 4, sm: 6 },
                    }
                  }}
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
                  sx={{
                    '& .MuiSlider-thumb': {
                      width: { xs: 12, sm: 15 },
                      height: { xs: 12, sm: 15 },
                    },
                    '& .MuiSlider-track': {
                      height: { xs: 4, sm: 6 },
                    }
                  }}
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
                  sx={{
                    '& .MuiSlider-thumb': {
                      width: { xs: 12, sm: 15 },
                      height: { xs: 12, sm: 15 },
                    },
                    '& .MuiSlider-track': {
                      height: { xs: 4, sm: 6 },
                    }
                  }}
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
                  sx={{
                    '& .MuiSlider-thumb': {
                      width: { xs: 12, sm: 15 },
                      height: { xs: 12, sm: 15 },
                    },
                    '& .MuiSlider-track': {
                      height: { xs: 4, sm: 6 },
                    }
                  }}
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
                    sx={{
                      '& .MuiSlider-thumb': {
                        width: { xs: 12, sm: 15 },
                        height: { xs: 12, sm: 15 },
                      },
                      '& .MuiSlider-track': {
                        height: { xs: 4, sm: 6 },
                      }
                    }}
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
                    sx={{
                      '& .MuiSlider-thumb': {
                        width: { xs: 12, sm: 15 },
                        height: { xs: 12, sm: 15 },
                      },
                      '& .MuiSlider-track': {
                        height: { xs: 4, sm: 6 },
                      }
                    }}
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
                        sx={{
                          '& .MuiSlider-thumb': {
                            width: { xs: 12, sm: 15 },
                            height: { xs: 12, sm: 15 },
                          },
                          '& .MuiSlider-track': {
                            height: { xs: 4, sm: 6 },
                          }
                        }}
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
                </IconButton >
              </Tooltip>
              <Typography variant="caption" align="center">
                Ulubione</Typography>
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
                <Icons.Star />
                </IconButton>
              </Tooltip>
              <Typography variant="caption" align="center">Specjalne
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
                  ><Icons.ThumbUp/>
                </IconButton>
              </Tooltip>
              <Typography variant="caption" align="center">Polecam
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Tooltip title="Nie polecam">
                <IconButton variant={selectedIcon === 'thumbDown' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedIcon('thumbDown')}
                   sx={{
                    color: selectedIcon === 'thumbsDown' ? 'grey' : 'inherit',
                  }}
                  ><Icons.ThumbDown/>
                </IconButton>
              </Tooltip>
              <Typography variant="caption" align="center">Nie polecam
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
          label="Zdjęcie"
          value={photoUrl}
          disabled
        />
          {photoUrl && (
            <Box mt={2}>
               <img src={photoUrl} alt="Wybrane zdjęcie" style={{ maxWidth: '250px', maxHeight: '250px' }} />
            </Box>
          )}
          <Typography variant="subtitle1" sx={{ mt: 2 }} align="center">Wybierz zdjęcie</Typography>
          <Box >
            <Button
              variant="contained"
              component="label" color="secondary" >
              <input
                accept="image/*" // Specify accepted file types
                type="file"
                onChange={handlePhoto}
                />
                </Button>
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
               Zapisz zmiany
          </Button>

            <Button variant="contained" sx={{ mt: 2 }} onClick={goBack}>
              Wróć

          </Button>
          </Box>
      </Box>
    </Container>
  );
};

export default EditReviewPage;