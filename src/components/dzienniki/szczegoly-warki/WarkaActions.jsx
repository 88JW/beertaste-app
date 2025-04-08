import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import BookIcon from '@mui/icons-material/Book';
import PrintIcon from '@mui/icons-material/Print';

const WarkaActions = ({ 
  handleArchiveWarka, 
  handleSaveAsRecipe, 
  handlePrint, 
  isMobile 
}) => {
  return (
    <Box className="no-print">
      <Box 
        display="flex" 
        flexDirection={{ xs: 'column', sm: 'row' }} 
        gap={{ xs: 0.75, sm: 1 }} 
        mt={{ xs: 1, sm: 2 }} 
        mb={{ xs: 1, sm: 2 }} 
        sx={{ '& > button': { width: { xs: '100%', sm: 'auto' } } }}
      >
        <Button 
          variant="contained" 
          color="warning" 
          onClick={handleArchiveWarka}
          startIcon={<ArchiveIcon />}
          size={isMobile ? "small" : "medium"}
        >
          Archiwizuj
        </Button>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleSaveAsRecipe}
          startIcon={<BookIcon />}
          size={isMobile ? "small" : "medium"}
        >
          Zapisz recepturę
        </Button>
        <Button 
          variant="outlined" 
          color="primary"
          onClick={handlePrint}
          startIcon={<PrintIcon />}
          size={isMobile ? "small" : "medium"}
        >
          Drukuj
        </Button>
      </Box>
      <Button 
        component={Link} 
        to="/dzienniki/warzenia" 
        variant="contained" 
        color="primary" 
        sx={{ mt: { xs: 0.5, sm: 2 } }} 
        className="no-print"
        size={isMobile ? "small" : "medium"}
        fullWidth={isMobile}
      >
        Powrót do warzenia
      </Button>
    </Box>
  );
};

export default WarkaActions;
