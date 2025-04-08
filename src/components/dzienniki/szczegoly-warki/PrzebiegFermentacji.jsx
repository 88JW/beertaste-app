import React from 'react';
import { 
  Typography, Paper, Grid, Box, Collapse, IconButton, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import NotesIcon from '@mui/icons-material/Notes';
import { calculateBrewingDays, formatDate } from './utils';

const PrzebiegFermentacji = ({ 
  warka, 
  przebiegFermentacji, 
  handleDeletePomiar, 
  expandedSections, 
  toggleSection, 
  isMobile 
}) => {
  return (
    <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2, md: 3 } }} className="page-break">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Przebieg fermentacji
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2" sx={{ mr: 2, fontWeight: "medium", color: "text.secondary" }}>
            Dni warzenia: <strong>{calculateBrewingDays(warka.dataNastawienia)}</strong>
          </Typography>
          <IconButton onClick={() => toggleSection('fermentationProgress')} size="small" className="no-print">
            {expandedSections.fermentationProgress ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>
      
      <Collapse in={expandedSections.fermentationProgress}>
        {przebiegFermentacji.length > 0 ? (
          <>
            {/* Desktop view */}
            <DesktopTableView 
              przebiegFermentacji={przebiegFermentacji} 
              handleDeletePomiar={handleDeletePomiar} 
            />
            
            {/* Mobile view */}
            <MobileCardView 
              przebiegFermentacji={przebiegFermentacji} 
              handleDeletePomiar={handleDeletePomiar} 
            />
          </>
        ) : (
          <Typography sx={{ mt: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Brak wpisów w przebiegu fermentacji
          </Typography>
        )}
      </Collapse>
    </Paper>
  );
};

const DesktopTableView = ({ przebiegFermentacji, handleDeletePomiar }) => (
  <Box sx={{ overflowX: 'auto' }}>
    <TableContainer component={Paper} sx={{ mt: { xs: 1, sm: 2 } }}>
      <Table size="small" sx={{ 
        '& .MuiTableCell-root': {
          px: { xs: 1, sm: 2 },
          py: { xs: 0.75, sm: 1 },
          fontSize: { xs: '0.7rem', sm: '0.875rem' }
        }
      }}>
        <TableHead>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>BLG</TableCell>
            <TableCell>Temp.</TableCell>
            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Piana</TableCell>
            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>CO2</TableCell>
            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Notatki</TableCell>
            <TableCell align="right">Akcje</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {przebiegFermentacji.map((pomiar) => (
            <TableRow key={pomiar.id}>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                {formatDate(pomiar.dataPomiaru)}
              </TableCell>
              <TableCell>{pomiar.blg}</TableCell>
              <TableCell>{pomiar.temperatura}</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{pomiar.piana ? "Tak" : "Nie"}</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{pomiar.co2 ? "Tak" : "Nie"}</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                {pomiar.notatki}
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => handleDeletePomiar(pomiar.id)}
                    title="Usuń pomiar"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small"
                    sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                    onClick={() => alert(pomiar.notatki || 'Brak notatek')}
                    disabled={!pomiar.notatki}
                  >
                    <NotesIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

const MobileCardView = ({ przebiegFermentacji, handleDeletePomiar }) => (
  <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 2 }}>
    <Typography variant="subtitle2" gutterBottom sx={{
      fontSize: '0.8rem',
      fontStyle: 'italic',
      color: 'text.secondary'
    }}>
      Przesuń w lewo, aby zobaczyć więcej pomiarów
    </Typography>
    <Box sx={{ mt: 1 }}>
      {przebiegFermentacji.map((pomiar) => (
        <Paper 
          key={pomiar.id} 
          elevation={1} 
          sx={{
            mb: 1, 
            p: 1.5,
            fontSize: '0.8rem'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
              {formatDate(pomiar.dataPomiaru)}
            </Typography>
            <IconButton 
              size="small" 
              color="error" 
              onClick={() => handleDeletePomiar(pomiar.id)}
              sx={{ p: 0.5 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box mt={1}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>BLG:</strong> {pomiar.blg}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Temp:</strong> {pomiar.temperatura}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Piana:</strong> {pomiar.piana ? "Tak" : "Nie"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>CO2:</strong> {pomiar.co2 ? "Tak" : "Nie"}
                </Typography>
              </Grid>
              {pomiar.notatki && (
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    <strong>Notatki:</strong> {pomiar.notatki}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </Paper>
      ))}
    </Box>
  </Box>
);

export default PrzebiegFermentacji;
