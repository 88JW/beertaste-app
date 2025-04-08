import React from 'react';
import { Grid, TextField, Button, Collapse, IconButton, Box } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';

const AddMeasurementForm = ({ formData, handleChange, handleSubmit, toggleSection, expandedSections, isMobile }) => (
  <Box>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h6">Dodaj pomiar</Typography>
      <IconButton onClick={() => toggleSection('addMeasurement')} size="small">
        {expandedSections.addMeasurement ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
    </Box>
    <Collapse in={expandedSections.addMeasurement}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="datetime-local"
              name="dataPomiaru"
              label="Data pomiaru"
              value={formData.dataPomiaru}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* ...other fields... */}
          <Grid item xs={12}>
            <Button type="submit">Dodaj pomiar</Button>
          </Grid>
        </Grid>
      </form>
    </Collapse>
  </Box>
);

export default AddMeasurementForm;
