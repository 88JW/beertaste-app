import React from 'react';
import { 
  TextField, Typography, Paper, Grid, Box, Collapse, IconButton, Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const WarkaDetails = ({ 
  warka, 
  isEditing, 
  setIsEditing, 
  editFormData, 
  handleEditChange, 
  handleSaveEdit,
  expandedSections,
  toggleSection,
  isMobile
}) => {
  return (
    <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      <Box display="flex" 
        flexDirection={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        mb={{ xs: 1, sm: 2 }}>
        <Typography variant="h6" sx={{ 
          mb: { xs: 1, sm: 0 },
          fontSize: { xs: '1rem', sm: '1.25rem' }
        }}>
          {!isEditing ? "Informacje o warce" : "Edytuj szczegóły warki"}
        </Typography>
        <Box display="flex" 
          alignItems="center" 
          className="no-print"
          flexWrap="wrap"
          gap={0.5}>
          {!isEditing && (
            <Button 
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
              variant="outlined"
              size="small"
              sx={{ py: { xs: 0.5 }, px: { xs: 1 } }}
            >
              Edytuj
            </Button>
          )}
          <IconButton onClick={() => toggleSection('details')} size="small">
            {expandedSections.details ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>
      <Collapse in={expandedSections.details}>
        {!isEditing ? (
          <ViewMode warka={warka} isMobile={isMobile} />
        ) : (
          <EditMode 
            editFormData={editFormData}
            handleEditChange={handleEditChange}
            handleSaveEdit={handleSaveEdit}
            setIsEditing={setIsEditing}
            isMobile={isMobile}
          />
        )}
      </Collapse>
    </Paper>
  );
};

const ViewMode = ({ warka, isMobile }) => (
  <Grid container spacing={{ xs: 1, sm: 2 }}>
    <Grid item xs={12} sm={6}>
      <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
        <strong>Nazwa warki:</strong> {warka.nazwaWarki}
      </Typography>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
        <strong>Data nastawienia:</strong> {warka.dataNastawienia}
      </Typography>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
        <strong>Rodzaj piwa:</strong> {warka.rodzajPiwa}
      </Typography>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
        <strong>Drożdże:</strong> {warka.drozdze}
      </Typography>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
        <strong>Chmiele:</strong> {warka.chmiele}
      </Typography>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
        <strong>Rodzaj cukru:</strong> {warka.rodzajCukru}
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography sx={{ whiteSpace: 'pre-wrap', mt: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
        <strong>Notatki:</strong><br />
        {warka.notatki}
      </Typography>
    </Grid>
  </Grid>
);

const EditMode = ({ editFormData, handleEditChange, handleSaveEdit, setIsEditing, isMobile }) => (
  <Grid container spacing={{ xs: 1, sm: 2 }}>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Nazwa Warki"
        name="nazwaWarki"
        value={editFormData.nazwaWarki}
        onChange={handleEditChange}
        size={isMobile ? "small" : "medium"}
        margin={isMobile ? "dense" : "normal"}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        type="date"
        label="Data nastawienia"
        name="dataNastawienia"
        value={editFormData.dataNastawienia}
        onChange={handleEditChange}
        InputLabelProps={{
          shrink: true,
        }}
        size={isMobile ? "small" : "medium"}
        margin={isMobile ? "dense" : "normal"}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Rodzaj Piwa"
        name="rodzajPiwa"
        value={editFormData.rodzajPiwa}
        onChange={handleEditChange}
        size={isMobile ? "small" : "medium"}
        margin={isMobile ? "dense" : "normal"}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Drożdże"
        name="drozdze"
        value={editFormData.drozdze}
        onChange={handleEditChange}
        size={isMobile ? "small" : "medium"}
        margin={isMobile ? "dense" : "normal"}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Chmiele"
        name="chmiele"
        value={editFormData.chmiele}
        onChange={handleEditChange}
        size={isMobile ? "small" : "medium"}
        margin={isMobile ? "dense" : "normal"}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Rodzaj Cukru"
        name="rodzajCukru"
        value={editFormData.rodzajCukru}
        onChange={handleEditChange}
        size={isMobile ? "small" : "medium"}
        margin={isMobile ? "dense" : "normal"}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Notatki"
        name="notatki"
        value={editFormData.notatki}
        onChange={handleEditChange}
        multiline
        minRows={isMobile ? 2 : 3}
        size={isMobile ? "small" : "medium"}
        margin={isMobile ? "dense" : "normal"}
        sx={{
          '& .MuiInputBase-root': {
            resize: 'vertical',
            overflow: 'auto',
            minHeight: { xs: '80px', sm: '100px' },
          },
          '& textarea': {
            resize: 'vertical',
            overflow: 'auto',
            transition: 'none',
          }
        }}
      />
    </Grid>
    <Grid item xs={12}>
      <Box mt={{ xs: 1, sm: 2 }} display="flex" gap={{ xs: 1, sm: 2 }} flexDirection={{ xs: 'column', sm: 'row' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveEdit}
          fullWidth={isMobile}
          size={isMobile ? "small" : "medium"}
        >
          Zapisz
        </Button>
        <Button
          variant="outlined"
          startIcon={<CancelIcon />}
          onClick={() => setIsEditing(false)}
          fullWidth={isMobile}
          size={isMobile ? "small" : "medium"}
        >
          Anuluj
        </Button>
      </Box>
    </Grid>
  </Grid>
);

export default WarkaDetails;
