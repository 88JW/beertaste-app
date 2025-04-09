import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Grid, Card, CardContent, Button, 
  Box, Paper, Tabs, Tab, TextField, IconButton, Chip,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Snackbar, Alert, Divider, FormControl, InputLabel, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';

// Funkcja pomocnicza dla panelu Tab
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

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
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('slody');
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    description: '',
    amount: '',
    unit: 'kg',
    category: 'slody'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedIngredient, setEditedIngredient] = useState(null);

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue < 4) {
      setCurrentCategory(['slody', 'chmiele', 'drozdze', 'dodatki'][newValue]);
    }
  };

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

  const handleDeleteClick = (id, category) => {
    setDeleteTarget({ id, category });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
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
      handleCloseDialog();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIngredient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
  };

  const handleAddDialogSubmit = async () => {
    if (!newIngredient.name) {
      showSnackbar('Nazwa składnika jest wymagana', 'error');
      return;
    }

    try {
      const data = {
        ...newIngredient,
        userId: auth.currentUser.uid,
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'skladniki'), data);
      
      setIngredients(prev => ({
        ...prev,
        [data.category]: [
          ...prev[data.category],
          { id: docRef.id, ...data }
        ]
      }));
      
      showSnackbar('Składnik został dodany', 'success');
      setOpenAddDialog(false);
    } catch (error) {
      console.error('Błąd podczas dodawania składnika:', error);
      showSnackbar('Nie udało się dodać składnika', 'error');
    }
  };

  const handleEditClick = (item, category) => {
    setEditedIngredient({
      ...item,
      category
    });
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setEditedIngredient(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedIngredient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditDialogSubmit = async () => {
    if (!editedIngredient) return;

    try {
      const { id, category, ...updateData } = editedIngredient;
      
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

  const getUnitOptions = (category) => {
    switch (category) {
      case 'slody':
        return ['kg', 'g'];
      case 'chmiele':
        return ['g', 'kg', 'oz'];
      case 'drozdze':
        return ['opakowanie', 'g', 'ml'];
      case 'dodatki':
        return ['g', 'kg', 'ml', 'l', 'szt'];
      default:
        return ['szt'];
    }
  };

  const getCategoryName = (category) => {
    switch (category) {
      case 'slody': return 'Słód';
      case 'chmiele': return 'Chmiel';
      case 'drozdze': return 'Drożdże';
      case 'dodatki': return 'Dodatek';
      default: return category;
    }
  };

  const handleSortChange = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getAllIngredients = () => {
    const all = [];
    
    for (const category in ingredients) {
      ingredients[category].forEach(item => {
        all.push({
          ...item,
          categoryName: getCategoryName(category)
        });
      });
    }
    
    return all.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      if (sortField === 'category') {
        valueA = a.categoryName;
        valueB = b.categoryName;
      }
      
      if (valueA < valueB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      
      if (sortField !== 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  };

  const renderIngredientList = (category) => {
    const items = ingredients[category];
    
    if (loading) {
      return <Typography>Ładowanie...</Typography>;
    }
    
    if (items.length === 0) {
      return <Typography>Brak dodanych składników</Typography>;
    }
    
    return (
      <Grid container spacing={2}>
        {items.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" component="div" gutterBottom>
                    {item.name}
                  </Typography>
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditClick(item, category)}
                      color="primary"
                      sx={{ mr: 0.5 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteClick(item.id, category)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                
                {item.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {item.description}
                  </Typography>
                )}
                
                {item.amount && (
                  <Chip 
                    label={`${item.amount} ${item.unit || ''}`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderAllIngredients = () => {
    const allIngredients = getAllIngredients();
    
    if (loading) {
      return <Typography>Ładowanie...</Typography>;
    }
    
    if (allIngredients.length === 0) {
      return <Typography>Brak dodanych składników</Typography>;
    }
    
    const renderSortArrow = (field) => {
      if (sortField !== field) return null;
      return sortDirection === 'asc' ? ' ↑' : ' ↓';
    };
    
    return (
      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }} aria-label="lista wszystkich składników">
          <TableHead>
            <TableRow>
              <TableCell 
                onClick={() => handleSortChange('name')}
                sx={{ cursor: 'pointer', fontWeight: sortField === 'name' ? 'bold' : 'normal' }}
              >
                Nazwa{renderSortArrow('name')}
              </TableCell>
              <TableCell 
                onClick={() => handleSortChange('category')}
                sx={{ cursor: 'pointer', fontWeight: sortField === 'category' ? 'bold' : 'normal' }}
              >
                Kategoria{renderSortArrow('category')}
              </TableCell>
              <TableCell 
                onClick={() => handleSortChange('amount')}
                sx={{ cursor: 'pointer', fontWeight: sortField === 'amount' ? 'bold' : 'normal' }}
              >
                Ilość{renderSortArrow('amount')}
              </TableCell>
              <TableCell>Opis</TableCell>
              <TableCell align="right">Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allIngredients.map((item) => (
              <TableRow
                key={item.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="body1" fontWeight="medium">
                    {item.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={item.categoryName} 
                    size="small"
                    color={
                      item.category === 'slody' ? 'warning' :
                      item.category === 'chmiele' ? 'success' :
                      item.category === 'drozdze' ? 'info' : 'default'
                    }
                  />
                </TableCell>
                <TableCell>
                  {item.amount ? `${item.amount} ${item.unit || ''}` : '-'}
                </TableCell>
                <TableCell>{item.description || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    size="small" 
                    onClick={() => handleEditClick(item, item.category)}
                    color="primary"
                    sx={{ mr: 0.5 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteClick(item.id, item.category)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
            {renderIngredientList('slody')}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {renderIngredientList('chmiele')}
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            {renderIngredientList('drozdze')}
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            {renderIngredientList('dodatki')}
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            {renderAllIngredients()}
          </TabPanel>
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Potwierdź usunięcie</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz usunąć ten składnik? Tej operacji nie można cofnąć.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Anuluj</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Usuń
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddDialog} onClose={handleAddDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Dodaj nowy składnik</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nazwa składnika"
            type="text"
            fullWidth
            value={newIngredient.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="description"
            label="Opis (opcjonalny)"
            type="text"
            fullWidth
            multiline
            rows={2}
            value={newIngredient.description}
            onChange={handleInputChange}
          />
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="category-label">Kategoria</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={newIngredient.category}
                onChange={handleInputChange}
                label="Kategoria"
              >
                <MenuItem value="slody">Słody</MenuItem>
                <MenuItem value="chmiele">Chmiele</MenuItem>
                <MenuItem value="drozdze">Drożdże</MenuItem>
                <MenuItem value="dodatki">Dodatki</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              margin="dense"
              name="amount"
              label="Ilość"
              type="number"
              value={newIngredient.amount}
              onChange={handleInputChange}
              sx={{ flexGrow: 1 }}
            />
            <FormControl sx={{ minWidth: 120, mt: 1 }}>
              <InputLabel id="unit-label">Jednostka</InputLabel>
              <Select
                labelId="unit-label"
                name="unit"
                value={newIngredient.unit}
                onChange={handleInputChange}
                label="Jednostka"
              >
                {getUnitOptions(newIngredient.category).map(unit => (
                  <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Anuluj</Button>
          <Button onClick={handleAddDialogSubmit} color="primary">
            Dodaj
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={handleEditDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edytuj składnik</DialogTitle>
        <DialogContent>
          {editedIngredient && (
            <>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Nazwa składnika"
                type="text"
                fullWidth
                value={editedIngredient.name}
                onChange={handleEditInputChange}
                disabled
              />
              <TextField
                margin="dense"
                name="description"
                label="Opis (opcjonalny)"
                type="text"
                fullWidth
                multiline
                rows={2}
                value={editedIngredient.description || ''}
                onChange={handleEditInputChange}
              />
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <TextField
                  margin="dense"
                  name="amount"
                  label="Ilość"
                  type="number"
                  value={editedIngredient.amount || ''}
                  onChange={handleEditInputChange}
                  sx={{ flexGrow: 1 }}
                  helperText="Zaktualizuj ilość, jeśli zużyłeś część składnika"
                />
                <FormControl sx={{ minWidth: 120, mt: 1 }}>
                  <InputLabel id="edit-unit-label">Jednostka</InputLabel>
                  <Select
                    labelId="edit-unit-label"
                    name="unit"
                    value={editedIngredient.unit || ''}
                    onChange={handleEditInputChange}
                    label="Jednostka"
                  >
                    {getUnitOptions(editedIngredient.category).map(unit => (
                      <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Anuluj</Button>
          <Button onClick={handleEditDialogSubmit} color="primary">
            Zapisz zmiany
          </Button>
        </DialogActions>
      </Dialog>

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
