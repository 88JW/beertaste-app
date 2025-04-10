import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Box, Button, Paper, Tabs, Tab,
  Snackbar, Alert, useTheme, useMediaQuery
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AddIcon from '@mui/icons-material/Add';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';

// Import components directly from their files instead of the barrel file
import TabPanel from './mojeSkladniki/TabPanel';
import CategoryIngredientList from './mojeSkladniki/CategoryIngredientList';
import AllIngredientsList from './mojeSkladniki/AllIngredientsList';
import AddIngredientDialog from './mojeSkladniki/AddIngredientDialog';
import EditIngredientDialog from './mojeSkladniki/EditIngredientDialog';
import DeleteConfirmationDialog from './mojeSkladniki/DeleteConfirmationDialog';
import { printStyles } from './mojeSkladniki/utils';

function MojeSkladniki() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
    <Container 
      maxWidth="lg" 
      sx={{ 
        mt: { xs: 2, sm: 3, md: 4 }, 
        mb: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 }
      }}
    >
      <style>{printStyles}</style>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIosNewIcon />}
        onClick={() => navigate("/dzienniki")}
        sx={{ 
          mb: { xs: 1.5, sm: 2 },
          py: { xs: 0.5, sm: 0.75 },
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}
        size={isMobile ? "small" : "medium"}
      >
        Powrót do dzienników
      </Button>

      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 1.5, sm: 2, md: 3 }, 
          borderRadius: { xs: 2, sm: 3 },
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          mb: { xs: 1.5, sm: 2 },
          gap: { xs: 1, sm: 0 }
        }}>
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            Moje Składniki
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddIngredient}
            size={isMobile ? "small" : "medium"}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
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
              allowScrollButtonsMobile
              sx={{
                '& .MuiTab-root': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  minWidth: { xs: 'auto', sm: 80 },
                  padding: { xs: '6px 10px', sm: '12px 16px' }
                }
              }}
            >
              <Tab label="Słody" />
              <Tab label="Chmiele" />
              <Tab label="Drożdże" />
              <Tab label="Dodatki" />
              <Tab label="Wszystkie" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <CategoryIngredientList 
              items={ingredients.slody} 
              loading={loading} 
              onEdit={handleEditClick} 
              onDelete={handleDeleteClick} 
              category="slody" 
              isMobile={isMobile}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <CategoryIngredientList 
              items={ingredients.chmiele} 
              loading={loading} 
              onEdit={handleEditClick} 
              onDelete={handleDeleteClick} 
              category="chmiele" 
              isMobile={isMobile}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <CategoryIngredientList 
              items={ingredients.drozdze} 
              loading={loading} 
              onEdit={handleEditClick} 
              onDelete={handleDeleteClick} 
              category="drozdze" 
              isMobile={isMobile}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <CategoryIngredientList 
              items={ingredients.dodatki} 
              loading={loading} 
              onEdit={handleEditClick} 
              onDelete={handleDeleteClick} 
              category="dodatki" 
              isMobile={isMobile}
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
              isMobile={isMobile}
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
        isMobile={isMobile}
      />
      
      <EditIngredientDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        ingredient={editedIngredient}
        onSubmit={handleEditDialogSubmit}
        isMobile={isMobile}
      />
      
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        isMobile={isMobile}
      />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default MojeSkladniki;
