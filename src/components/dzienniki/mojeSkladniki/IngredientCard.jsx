import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function IngredientCard({ item, onEdit, onDelete, isMobile }) {
  return (
    <Card 
      elevation={2} 
      sx={{ 
        height: '100%',
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
    >
      <CardContent sx={{ 
        p: { xs: 1.5, sm: 2 },
        '&:last-child': { pb: { xs: 1.5, sm: 2 } }
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.25rem' },
                fontWeight: 'medium',
                mb: 0.5
              }}
            >
              {item.name}
            </Typography>
            <Chip 
              label={item.amount ? `${item.amount} ${item.unit || ''}` : 'Ilość nieokreślona'}
              size={isMobile ? "small" : "medium"}
              color="primary"
              variant="outlined"
              sx={{ mb: 1, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            />
          </Box>
          <Box>
            <IconButton 
              size={isMobile ? "small" : "medium"} 
              onClick={onEdit}
              color="primary"
              sx={{ p: { xs: 0.5, sm: 1 } }}
            >
              <EditIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
            <IconButton 
              size={isMobile ? "small" : "medium"} 
              onClick={onDelete}
              color="error"
              sx={{ p: { xs: 0.5, sm: 1 } }}
            >
              <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Box>
        </Box>
        
        {item.description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mt: 1, 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              wordBreak: 'break-word'
            }}
          >
            {item.description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default IngredientCard;
