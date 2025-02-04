import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const IlePiwWypito = () => {
    const [amountDrank, setAmountDrank] = useState(0);
    const [currentAmount, setCurrentAmount] = useState(0);
    const [savedMessage, setSavedMessage] = useState('');
    const [error, setError] = useState(null);
    const user = auth.currentUser;

    useEffect(() => {
        const fetchBeerData = async () => {
            if (user) {
                console.log('Current user ID:', user.uid); // Logowanie ID użytkownika
                const userRef = doc(db, 'users', user.uid);
                try {
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        setCurrentAmount(userData.beerDrank || 0);
                    } else {
                         console.log('No such user in database!')
                    }
                } catch (err) {
                    setError('Error fetching beer data');
                    console.error('Error fetching beer data:', err);
                }
            } else {
                setError('User not logged in');
            }
        };

        fetchBeerData();
    }, [user]);

    const handleAmountChange = (event) => {
        setAmountDrank(parseInt(event.target.value));
    };

    const handleSave = async () => {
         if (user) {
            console.log('Current user ID:', user.uid); // Logowanie ID użytkownika
            const userRef = doc(db, 'users', user.uid);
            try {
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    const newAmount = (userData.beerDrank || 0) + amountDrank;
                    console.log('New amount:', newAmount); // Logowanie nowej wartości

                    await updateDoc(userRef, { beerDrank: newAmount });
                    setCurrentAmount(newAmount);
                    setSavedMessage('Zapisano!');
                }
            } catch (err) {
                setError('Error updating beer data');
                console.error('Error updating beer data:', err);
            } finally {
                setTimeout(() => {
                    setSavedMessage('');
                }, 3000);
            }
        }
        setAmountDrank(0);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', p: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <Typography variant="h6">Aktualna ilość wypitych piw: {currentAmount}</Typography>
            <TextField
                label="Ilość wypitych piw"
                type="number"
                value={amountDrank}
                onChange={handleAmountChange}
                InputProps={{ inputProps: { min: 0 } }}
            />
            <Button variant="contained" onClick={handleSave}>Zapisz</Button>
            {savedMessage && <Typography color="success">{savedMessage}</Typography>}
        </Box>
    );
};

export default IlePiwWypito;
