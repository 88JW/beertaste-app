import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, Button, FormControl, InputLabel, 
  Select, MenuItem
} from '@mui/material';
import { getUnitOptions } from './utils';

function AddIngredientDialog({ open, onClose, initialValues, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    unit: 'kg',
    category: 'slody'
  });

  // Aktualizacja formularza gdy otwieramy dialog z nowymi wartościami
  useEffect(() => {
    if (open && initialValues) {
      setFormData(initialValues);
    }
  }, [open, initialValues]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.name) {
      // Obsługa błędu - pole name jest wymagane
      return;
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Dodaj nowy składnik</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Nazwa składnika"
          type="text"
          fullWidth
          value={formData.name}
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
          value={formData.description}
          onChange={handleInputChange}
        />
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth margin="dense">
            <InputLabel id="category-label">Kategoria</InputLabel>
            <Select
              labelId="category-label"
              name="category"
              value={formData.category}
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
            value={formData.amount}
            onChange={handleInputChange}
            sx={{ flexGrow: 1 }}
          />
          <FormControl sx={{ minWidth: 120, mt: 1 }}>
            <InputLabel id="unit-label">Jednostka</InputLabel>
            <Select
              labelId="unit-label"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              label="Jednostka"
            >
              {getUnitOptions(formData.category).map(unit => (
                <MenuItem key={unit} value={unit}>{unit}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button onClick={handleSubmit} color="primary">
          Dodaj
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddIngredientDialog;
