
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import IlePiwWypito from "./IlePiwWypito";

const OcenPiwo = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/");
  const [lastReview, setLastReview] = useState(null);

  useEffect(() => {
    const fetchLastReview = async () => {
      const reviewsCollection = collection(db, "reviews");
      const q = query(reviewsCollection, orderBy("timestamp", "desc"), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setLastReview({ id: doc.id, ...doc.data() });
      }
    };
    fetchLastReview();
  }, []);


  
  return (
    <>
    <h1>Moje Piwne Podsumowanie</h1>
      
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",         
          alignItems: "center",   
        }}
      >
        <Paper elevation={3} sx={{ mt: 2 }}>
        <IlePiwWypito />
        </Paper> 

        <br></br>
        <Box className='boxContainer'>
        <Link to="/add-review" >
          <div className="tile">           
            Dodaj Ocenę
          </div>
        </Link>
        <Link to="/my-reviews" >
        <div className="tile">           
            Moje Oceny
          </div>
        </Link>
        </Box>
        
        <h2>Ostatni wpis:</h2>
        {lastReview && (
          <Card sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            
            <Link to={`/review/${lastReview.id}`}>
              {lastReview.photoUrl && (
                <CardMedia
                  sx={{ width: '100%', height: 'auto', marginTop: '10px', cursor: 'pointer' }}
                  component="img"
                  image={lastReview.photoUrl}
                  alt="Beer"
                />
              )}
            </Link>          
            
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {lastReview.beerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
              {lastReview.brewery} - {lastReview.style}
              </Typography>
            </CardContent>
          </Card>)}
      </Box>
      <Button sx={{ mt: 2 }} variant="contained" onClick={handleBack}>
        Wstecz
      </Button>
    </>
  );
};

export default OcenPiwo;