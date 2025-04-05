import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import {
  Button,
  Grid,
  Paper,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { db, auth } from '../../firebase';

function DziennikiWarzenia() {
  const [dzienniki, setDzienniki] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDiaryId, setDeleteDiaryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const tiles = [
    {
      id: 'historia-warzenia',
      title: 'Historia warzenia',
      path: '/historia-warzenia'
    }
  ];

  useEffect(() => {
    const fetchDzienniki = async () => {
        setLoading(true)
      if (!auth.currentUser) {
          setLoading(false);
        return;
      }
      try {
        const userId = auth.currentUser.uid;
        const dziennikiCollection = collection(db, 'dziennikiWarzenia');
        const q = query(dziennikiCollection, where('userId', '==', userId));
        const dziennikiSnapshot = await getDocs(q);
        const dziennikiList = dziennikiSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDzienniki(dziennikiList);
      } finally {
        setLoading(false);
        }
    };
    fetchDzienniki();
  }, []);

    const handleDiaryClick = (id) => {
        navigate(`/dzienniki/warzenia/${id}`);
    }
  const handleDeleteClick = (id) => {
    setDeleteDiaryId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const confirmDelete = async () => {
    if (deleteDiaryId) {
      try {
        await deleteDoc(doc(db, 'dziennikiWarzenia', deleteDiaryId));
        setDzienniki(dzienniki.filter((dziennik) => dziennik.id !== deleteDiaryId));
      } catch (error) {
        console.error('Error deleting diary: ', error);
      } finally {
        setDeleteDiaryId(null);
        setOpenDialog(false);
      }
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Dzienniki Warzenia</Typography>
      </Box>
      <Link to="/dzienniki/warzenia/add">
        <Button variant="contained" color="secondary">
          Dodaj nowy dziennik
        </Button>
      </Link>
      <Grid
        container
        spacing={2}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: (theme) => theme.spacing(2),
        }}>
        {dzienniki.map((dziennik) => (
          <Grid
            item
            sx={{
              flexBasis: '20rem',
              padding: (theme) => theme.spacing(1),
            }}
            key={dziennik.id}>
            <Paper
              elevation={3}
              sx={{
                padding: (theme) => theme.spacing(2),
                maxWidth: '30rem',
                position: 'relative',
                cursor: 'pointer',
              }}>
              <div onClick={() => handleDiaryClick(dziennik.id)}>
                <Typography variant="h6">Nazwa warki: {dziennik.nazwaWarki}</Typography>
                <Typography>Data nastawienia: {dziennik.dataNastawienia}</Typography>
                <Typography>Rodzaj piwa: {dziennik.rodzajPiwa}</Typography>
                <Typography>Drożdże: {dziennik.drozdz}</Typography>
                <Typography>Chmiele: {dziennik.chmiel}</Typography>
                <Typography>Rodzaj cukru: {dziennik.rodzajCukru}</Typography>
                <Typography>Notatki: {dziennik.notatki}</Typography>
              </div>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(dziennik.id);
                }}
                sx={{ position: 'absolute', top: 5, right: 5 }}>
                <DeleteIcon sx={{ color: 'red' }} />
              </IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <br></br>
      <Button component={Link} to="/dzienniki" variant="contained" color="primary">
        Wstecz
      </Button>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Potwierdzenie</DialogTitle>
        <DialogContent>Czy na pewno chcesz usunąć tę warkę?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Anuluj</Button>
          <Button onClick={confirmDelete}>Usuń</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DziennikiWarzenia;