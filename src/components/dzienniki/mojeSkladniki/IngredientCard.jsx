import React from 'react';
import { 
  Card, CardContent, Typography, 
  Box, IconButton, Chip 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function IngredientCard({ item, category, onEdit, onDelete }) {
  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="div" gutterBottom>
            {item.name}
          </Typography>
          <Box>
            <IconButton 
              size="small" 
              onClick={() => onEdit(item, category)}
              color="primary"
              sx={{ mr: 0.5 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => onDelete(item.id, category)}
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
  );
}

export default IngredientCard;
