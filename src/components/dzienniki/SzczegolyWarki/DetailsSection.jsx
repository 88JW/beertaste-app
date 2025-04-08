import React from 'react';
import { Grid, Typography, TextField, Collapse, IconButton, Box, Button } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, Edit as EditIcon } from '@mui/icons-material';

const DetailsSection = ({ warka, editFormData, isEditing, handleEditChange, handleSaveEdit, setIsEditing, toggleSection, expandedSections, isMobile }) => (
  <Box>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h6">Informacje o warce</Typography>
      <IconButton onClick={() => toggleSection('details')} size="small">
        {expandedSections.details ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
    </Box>
    <Collapse in={expandedSections.details}>
      {!isEditing ? (
        <Grid container spacing={2}>
          {/* Display details */}
          <Grid item xs={12} sm={6}>
            <Typography><strong>Nazwa warki:</strong> {warka.nazwaWarki}</Typography>
          </Grid>
          {/* ...other details... */}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {/* Edit form */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nazwa Warki"
              name="nazwaWarki"
              value={editFormData.nazwaWarki}
              onChange={handleEditChange}
            />
          </Grid>
          {/* ...other fields... */}
          <Grid item xs={12}>
            <Button onClick={handleSaveEdit}>Zapisz</Button>
            <Button onClick={() => setIsEditing(false)}>Anuluj</Button>
          </Grid>
        </Grid>
      )}
    </Collapse>
  </Box>
);

export default DetailsSection;
