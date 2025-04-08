import React from 'react';
import { 
  TextField, Button, Checkbox, FormControlLabel, Grid, Box, Collapse, 
  IconButton, Typography, Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const PomiarForm = ({ 
  formData, 
  dataPomiaru, 
  handleChange, 
  handleSubmit, 
  expandedSections, 
  toggleSection, 
  isMobile 
}) => {
  return (
    <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2, md: 3 } }} className="no-print">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Dodaj pomiar
        </Typography>
        <IconButton onClick={() => toggleSection('addMeasurement')} size="small">
          {expandedSections.addMeasurement ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      
      <Collapse in={expandedSections.addMeasurement}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={{ xs: 1, sm: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                type="datetime-local"
                name="dataPomiaru"
                label="Data pomiaru"
                value={dataPomiaru.toISOString().slice(0, 16)}
                onChange={handleChange}
                margin={isMobile ? "dense" : "normal"}
                size={isMobile ? "small" : "medium"}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="BLG"
                name="blg"
                value={formData.blg} 
                onChange={handleChange} 
                margin={isMobile ? "dense" : "normal"} 
                size={isMobile ? "small" : "medium"}
                fullWidth 
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField 
                label="Temperatura" 
                name="temperatura" 
                value={formData.temperatura} 
                onChange={handleChange} 
                margin={isMobile ? "dense" : "normal"} 
                size={isMobile ? "small" : "medium"}
                fullWidth 
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox name="piana" checked={formData.piana} onChange={handleChange} />}
                label="Piana"
                sx={{ '& .MuiTypography-root': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox name="co2" checked={formData.co2} onChange={handleChange} />}
                label="CO2"
                sx={{ '& .MuiTypography-root': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notatki"
                name="notatki"
                value={formData.notatki}
                onChange={handleChange}
                margin={isMobile ? "dense" : "normal"}
                size={isMobile ? "small" : "medium"}
                fullWidth
                multiline
                rows={isMobile ? 2 : 3}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                size={isMobile ? "small" : "medium"}
                sx={{ mt: { xs: 1, sm: 2 } }}
              >
                Dodaj pomiar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Collapse>
    </Paper>
  );
};

export default PomiarForm;
