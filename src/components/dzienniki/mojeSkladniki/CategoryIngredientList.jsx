import React from 'react';
import { Grid, Typography } from '@mui/material';
import IngredientCard from './IngredientCard';

function CategoryIngredientList({ items, loading, onEdit, onDelete, category }) {
  if (loading) {
    return <Typography>Ładowanie...</Typography>;
  }
  
  if (!items || items.length === 0) {
    return <Typography>Brak dodanych składników</Typography>;
  }
  
  return (
    <Grid container spacing={2}>
      {items.map(item => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
          <IngredientCard 
            item={item} 
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default CategoryIngredientList;
