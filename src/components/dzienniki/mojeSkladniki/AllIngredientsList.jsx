import React, { useRef } from 'react';
import { 
  Box, Typography, Paper, Table, TableContainer, TableHead, 
  TableBody, TableRow, TableCell, Grid, Card, CardContent, 
  Chip, IconButton, Button, Tooltip 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import { getCategoryName, getCategoryColor } from './utils';

function AllIngredientsList({ 
  ingredients, 
  loading, 
  sortField, 
  sortDirection, 
  onSortChange, 
  onEdit, 
  onDelete 
}) {
  const printContentRef = useRef(null);
  
  if (loading) {
    return <Typography>Ładowanie...</Typography>;
  }
  
  // Przygotuj wszystkie składniki jako jedną tablicę
  const getAllIngredients = () => {
    const all = [];
    
    for (const category in ingredients) {
      ingredients[category].forEach(item => {
        all.push({
          ...item,
          categoryName: getCategoryName(category),
          category // dodajemy oryginalną kategorię dla funkcji edycji/usuwania
        });
      });
    }
    
    // Sortowanie na podstawie aktualnych ustawień
    return all.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      if (sortField === 'category') {
        valueA = a.categoryName;
        valueB = b.categoryName;
      }
      
      if (valueA < valueB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      
      if (sortField !== 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  };
  
  const allIngredients = getAllIngredients();
  
  if (allIngredients.length === 0) {
    return <Typography>Brak dodanych składników</Typography>;
  }
  
  const renderSortArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };
  
  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 300);
  };
  
  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2} className="no-print">
        <Tooltip title="Drukuj listę składników">
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Drukuj listę
          </Button>
        </Tooltip>
      </Box>
      
      <div id="print-content" ref={printContentRef}>
        <Typography variant="h6" component="h2" gutterBottom className="print-only" sx={{ display: 'none' }}>
          Lista Składników
        </Typography>
        
        {/* Desktop view - tabela */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <TableContainer component={Paper} elevation={0}>
            <Table aria-label="lista wszystkich składników">
              <TableHead>
                <TableRow>
                  <TableCell 
                    onClick={() => onSortChange('name')}
                    sx={{ cursor: 'pointer', fontWeight: sortField === 'name' ? 'bold' : 'normal' }}
                  >
                    Nazwa{renderSortArrow('name')}
                  </TableCell>
                  <TableCell 
                    onClick={() => onSortChange('category')}
                    sx={{ cursor: 'pointer', fontWeight: sortField === 'category' ? 'bold' : 'normal' }}
                  >
                    Kategoria{renderSortArrow('category')}
                  </TableCell>
                  <TableCell 
                    onClick={() => onSortChange('amount')}
                    sx={{ cursor: 'pointer', fontWeight: sortField === 'amount' ? 'bold' : 'normal' }}
                  >
                    Ilość{renderSortArrow('amount')}
                  </TableCell>
                  <TableCell>Opis</TableCell>
                  <TableCell align="right" className="no-print">Akcje</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allIngredients.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography variant="body1" fontWeight="medium">
                        {item.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={item.categoryName} 
                        size="small"
                        color={getCategoryColor(item.category)}
                      />
                    </TableCell>
                    <TableCell>
                      {item.amount ? `${item.amount} ${item.unit || ''}` : '-'}
                    </TableCell>
                    <TableCell>{item.description || '-'}</TableCell>
                    <TableCell align="right" className="no-print">
                      <IconButton 
                        size="small" 
                        onClick={() => onEdit(item, item.category)}
                        color="primary"
                        sx={{ mr: 0.5 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => onDelete(item.id, item.category)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        
        {/* Mobile view - karty */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Box display="flex" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mr: 1 }}>Sortuj po:</Typography>
            <Chip 
              label={`${sortField === 'name' ? 'Nazwa' : sortField === 'category' ? 'Kategoria' : 'Ilość'} ${sortDirection === 'asc' ? '↑' : '↓'}`}
              onClick={() => {
                if (sortField === 'name') {
                  onSortChange('category');
                } else if (sortField === 'category') {
                  onSortChange('amount');
                } else {
                  onSortChange('name');
                }
              }}
              color="primary"
              variant="outlined"
            />
          </Box>
          
          <Grid container spacing={2}>
            {allIngredients.map(item => (
              <Grid item xs={12} key={item.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="h6" component="div" gutterBottom>
                          {item.name}
                        </Typography>
                        <Chip 
                          label={item.categoryName} 
                          size="small"
                          color={getCategoryColor(item.category)}
                          sx={{ mb: 1 }}
                        />
                      </Box>
                      <Box className="no-print">
                        <IconButton 
                          size="small" 
                          onClick={() => onEdit(item, item.category)}
                          color="primary"
                          sx={{ mr: 0.5 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => onDelete(item.id, item.category)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    {item.amount && (
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" component="span">
                          Ilość: 
                        </Typography>
                        <Chip 
                          label={`${item.amount} ${item.unit || ''}`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    )}
                    
                    {item.description && (
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    </>
  );
}

export default AllIngredientsList;
