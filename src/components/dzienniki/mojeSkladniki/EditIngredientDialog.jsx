import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, Button, FormControl, InputLabel, 
  Select, MenuItem
} from '@mui/material';
import { getUnitOptions } from './utils';

function EditIngredientDialog({ open, onClose, ingredient, onSubmit }) {
  const [formData, setFormData] = useState(null);

  // Aktualizacja formularza gdy otwieramy dialog z danymi składnika
  useEffect(() => {
    if (open && ingredient) {
      setFormData(ingredient);
    }
  }, [open, ingredient]);

  if (!formData) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edytuj składnik</DialogTitle>
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
          value={formData.description || ''}
          onChange={handleInputChange}
        />
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            margin="dense"
            name="amount"
            label="Ilość"
            type="number"
            value={formData.amount || ''}
            onChange={handleInputChange}
            sx={{ flexGrow: 1 }}
            helperText="Zaktualizuj ilość, jeśli zużyłeś część składnika"
          />
          <FormControl sx={{ minWidth: 120, mt: 1 }}>
            <InputLabel id="edit-unit-label">Jednostka</InputLabel>
            <Select
              labelId="edit-unit-label"
              name="unit"
              value={formData.unit || ''}
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
          Zapisz zmiany
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditIngredientDialog;
