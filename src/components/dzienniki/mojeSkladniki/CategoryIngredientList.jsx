import React from 'react';
import { Grid, Typography, Box, CircularProgress } from '@mui/material';
import IngredientCard from './IngredientCard';

function CategoryIngredientList({ items, loading, onEdit, onDelete, category, isMobile }) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={isMobile ? 30 : 40} />
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Typography 
        variant="body1" 
        sx={{ 
          textAlign: 'center', 
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '0.875rem', sm: '1rem' } 
        }}
      >
        Brak składników w tej kategorii. Kliknij "Dodaj Składnik" aby dodać nowy.
      </Typography>
    );
  }

  return (
    <Grid container spacing={{ xs: 1, sm: 2 }}>
      {items.map(item => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
          <IngredientCard 
            item={item} 
            onEdit={() => onEdit(item, category)} 
            onDelete={() => onDelete(item.id, category)}
            isMobile={isMobile}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default CategoryIngredientList;
