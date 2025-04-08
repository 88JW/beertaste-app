import React from 'react';
import { Box, Button } from '@mui/material';
import { Archive as ArchiveIcon, Book as BookIcon, Print as PrintIcon } from '@mui/icons-material';

const ActionsSection = ({ handleArchiveWarka, handleSaveAsRecipe, handlePrint, isMobile }) => (
  <Box display="flex" gap={2}>
    <Button onClick={handleArchiveWarka} startIcon={<ArchiveIcon />}>Archiwizuj</Button>
    <Button onClick={handleSaveAsRecipe} startIcon={<BookIcon />}>Zapisz recepturę</Button>
    <Button onClick={handlePrint} startIcon={<PrintIcon />}>Drukuj</Button>
  </Box>
);

export default ActionsSection;
