import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Alert, IconButton, Menu, MenuItem } from '@mui/material';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const IlePiwWypito = () => {
    const [amountDrank, setAmountDrank] = useState(0);
    const [currentAmount, setCurrentAmount] = useState(0);
    const [savedMessage, setSavedMessage] = useState('');
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [amountToSubtract, setAmountToSubtract] = useState(0);
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

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSubtractChange = (event) => {
        setAmountToSubtract(parseInt(event.target.value));
    };

    const handleSubtract = async () => {
        if (user) {
            console.log('Current user ID:', user.uid); // Logowanie ID użytkownika
            const userRef = doc(db, 'users', user.uid);
            try {
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    const newAmount = Math.max((userData.beerDrank || 0) - amountToSubtract, 0);
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
        setAmountToSubtract(0);
        handleMenuClose();
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button variant="contained" onClick={handleSave}>Zapisz</Button>
                <IconButton onClick={handleMenuClick}>
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <Box sx={{ p: 2 }}>
                        <TextField
                            label="Odejmij ilość piw"
                            type="number"
                            value={amountToSubtract}
                            onChange={handleSubtractChange}
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                        <Button variant="contained" onClick={handleSubtract} sx={{ mt: 1 }}>Odejmij</Button>
                    </Box>
                </Menu>
            </Box>
            {savedMessage && <Typography color="success">{savedMessage}</Typography>}
        </Box>
    );
};

export default IlePiwWypito;
