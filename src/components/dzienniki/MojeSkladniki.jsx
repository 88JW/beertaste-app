import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Box, Button, Paper, Tabs, Tab,
  Snackbar, Alert
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AddIcon from '@mui/icons-material/Add';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';

// Importujemy komponenty
import { 
  TabPanel, 
  CategoryIngredientList, 
  AllIngredientsList,
  AddIngredientDialog,
  EditIngredientDialog,
  DeleteConfirmationDialog,
  printStyles
} from './mojeSkladniki';

function MojeSkladniki() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [ingredients, setIngredients] = useState({
    slody: [],
    chmiele: [],
    drozdze: [],
    dodatki: []
  });
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState('slody');
  
  // Dialogi
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Stan dla dialogów
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    description: '',
    amount: '',
    unit: 'kg',
    category: 'slody'
  });
  const [editedIngredient, setEditedIngredient] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  // Sortowanie
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Obsługa komunikatów
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Pobierz składniki z bazy danych
  useEffect(() => {
    const fetchIngredients = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const userId = auth.currentUser.uid;
        const categories = ['slody', 'chmiele', 'drozdze', 'dodatki'];
        const fetchedIngredients = {
          slody: [],
          chmiele: [],
          drozdze: [],
          dodatki: []
        };

        for (const category of categories) {
          const q = query(
            collection(db, 'skladniki'),
            where('userId', '==', userId),
            where('category', '==', category)
          );
          const querySnapshot = await getDocs(q);
          fetchedIngredients[category] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        }

        setIngredients(fetchedIngredients);
      } catch (error) {
        console.error('Błąd podczas pobierania składników:', error);
        showSnackbar('Nie udało się pobrać składników', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  // Obsługa zmiany zakładki
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue < 4) {
      setCurrentCategory(['slody', 'chmiele', 'drozdze', 'dodatki'][newValue]);
    }
  };

  // Obsługa dodawania składnika
  const handleAddIngredient = () => {
    setNewIngredient({
      name: '',
      description: '',
      amount: '',
      unit: currentCategory === 'slody' ? 'kg' : currentCategory === 'chmiele' ? 'g' : '',
      category: currentCategory
    });
    setOpenAddDialog(true);
  };

  // Obsługa dodania składnika (zatwierdzenie)
  const handleAddDialogSubmit = async (data) => {
    try {
      const ingredientData = {
        ...data,
        userId: auth.currentUser.uid,
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'skladniki'), ingredientData);
      
      setIngredients(prev => ({
        ...prev,
        [data.category]: [
          ...prev[data.category],
          { id: docRef.id, ...ingredientData }
        ]
      }));
      
      showSnackbar('Składnik został dodany', 'success');
      setOpenAddDialog(false);
    } catch (error) {
      console.error('Błąd podczas dodawania składnika:', error);
      showSnackbar('Nie udało się dodać składnika', 'error');
    }
  };

  // Obsługa edycji składnika
  const handleEditClick = (item, category) => {
    setEditedIngredient({
      ...item,
      category
    });
    setOpenEditDialog(true);
  };

  // Obsługa edycji składnika (zatwierdzenie)
  const handleEditDialogSubmit = async (editedData) => {
    try {
      const { id, category, ...updateData } = editedData;
      
      const ingredientRef = doc(db, 'skladniki', id);
      await updateDoc(ingredientRef, updateData);
      
      setIngredients(prev => ({
        ...prev,
        [category]: prev[category].map(item => 
          item.id === id ? { ...item, ...updateData } : item
        )
      }));
      
      showSnackbar('Składnik został zaktualizowany', 'success');
      setOpenEditDialog(false);
      setEditedIngredient(null);
    } catch (error) {
      console.error('Błąd podczas aktualizacji składnika:', error);
      showSnackbar('Nie udało się zaktualizować składnika', 'error');
    }
  };

  // Obsługa usuwania składnika
  const handleDeleteClick = (id, category) => {
    setDeleteTarget({ id, category });
    setOpenDeleteDialog(true);
  };

  // Obsługa usuwania składnika (zatwierdzenie)
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      await deleteDoc(doc(db, 'skladniki', deleteTarget.id));
      
      setIngredients(prev => ({
        ...prev,
        [deleteTarget.category]: prev[deleteTarget.category].filter(
          item => item.id !== deleteTarget.id
        )
      }));
      
      showSnackbar('Składnik został usunięty', 'success');
    } catch (error) {
      console.error('Błąd podczas usuwania składnika:', error);
      showSnackbar('Nie udało się usunąć składnika', 'error');
    } finally {
      setOpenDeleteDialog(false);
      setDeleteTarget(null);
    }
  };

  // Obsługa sortowania
  const handleSortChange = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Wyświetlanie komunikatów
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <style>{printStyles}</style>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIosNewIcon />}
        onClick={() => navigate("/dzienniki")}
        sx={{ mb: 2 }}
      >
        Powrót do dzienników
      </Button>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            Moje Składniki
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddIngredient}
          >
            Dodaj Składnik
          </Button>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="ingredient categories"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Słody" />
              <Tab label="Chmiele" />
              <Tab label="Drożdże" />
              <Tab label="Dodatki" />
              <Tab label="Wszystkie składniki" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <CategoryIngredientList 
              items={ingredients.slody} 
              loading={loading} 
              onEdit={handleEditClick} 
              onDelete={handleDeleteClick} 
              category="slody" 
            />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <CategoryIngredientList 
              items={ingredients.chmiele} 
              loading={loading} 
              onEdit={handleEditClick} 
              onDelete={handleDeleteClick} 
              category="chmiele" 
            />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <CategoryIngredientList 
              items={ingredients.drozdze} 
              loading={loading} 
              onEdit={handleEditClick} 
              onDelete={handleDeleteClick} 
              category="drozdze" 
            />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <CategoryIngredientList 
              items={ingredients.dodatki} 
              loading={loading} 
              onEdit={handleEditClick} 
              onDelete={handleDeleteClick} 
              category="dodatki" 
            />
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            <AllIngredientsList 
              ingredients={ingredients} 
              loading={loading}
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </TabPanel>
        </Box>
      </Paper>

      {/* Dialogi */}
      <AddIngredientDialog 
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        initialValues={newIngredient}
        onSubmit={handleAddDialogSubmit}
      />
      
      <EditIngredientDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        ingredient={editedIngredient}
        onSubmit={handleEditDialogSubmit}
      />
      
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
      />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default MojeSkladniki;
