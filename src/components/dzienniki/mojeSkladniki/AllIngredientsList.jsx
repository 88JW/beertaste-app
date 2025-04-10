import React, { useRef } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Card, CardContent, Chip, IconButton, CircularProgress,
  Button, Tooltip, Grid
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import { getCategoryColor, getCategoryName } from "./utils";

function AllIngredientsList({ 
  ingredients, 
  loading, 
  sortField, 
  sortDirection, 
  onSortChange, 
  onEdit, 
  onDelete,
  isMobile
}) {
  const printContentRef = useRef(null);
  
  const allIngredients = [
    ...ingredients.slody.map(item => ({ ...item, category: 'slody', categoryName: 'Słód' })),
    ...ingredients.chmiele.map(item => ({ ...item, category: 'chmiele', categoryName: 'Chmiel' })),
    ...ingredients.drozdze.map(item => ({ ...item, category: 'drozdze', categoryName: 'Drożdże' })),
    ...ingredients.dodatki.map(item => ({ ...item, category: 'dodatki', categoryName: 'Dodatek' }))
  ].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortField === 'category') {
      return sortDirection === 'asc' 
        ? a.categoryName.localeCompare(b.categoryName) 
        : b.categoryName.localeCompare(a.categoryName);
    } else if (sortField === 'amount') {
      const amountA = parseFloat(a.amount) || 0;
      const amountB = parseFloat(b.amount) || 0;
      return sortDirection === 'asc' ? amountA - amountB : amountB - amountA;
    }
    return 0;
  });
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={isMobile ? 30 : 40} />
      </Box>
    );
  }
  
  if (allIngredients.length === 0) {
    return (
      <Typography 
        variant="body1" 
        sx={{ 
          textAlign: 'center', 
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '0.875rem', sm: '1rem' } 
        }}
      >
        Brak składników. Kliknij "Dodaj Składnik" aby dodać nowy.
      </Typography>
    );
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
            size={isMobile ? "small" : "medium"}
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              py: { xs: 0.5, sm: 0.75 }
            }}
          >
            Drukuj listę
          </Button>
        </Tooltip>
      </Box>
      
      <div id="print-content" ref={printContentRef}>
        <Box className="print-only print-header" sx={{ display: 'none' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Lista Składników Piwowarskich
          </Typography>
          <Typography variant="subtitle1">
            Data wydruku: {new Date().toLocaleDateString()}
          </Typography>
        </Box>
        
        {/* Desktop view - tabela */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <TableContainer component={Paper} elevation={0}>
            <Table aria-label="lista wszystkich składników" size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  <TableCell 
                    onClick={() => onSortChange('name')}
                    sx={{ 
                      cursor: 'pointer', 
                      fontWeight: sortField === 'name' ? 'bold' : 'normal',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    Nazwa{renderSortArrow('name')}
                  </TableCell>
                  <TableCell 
                    onClick={() => onSortChange('category')}
                    sx={{ 
                      cursor: 'pointer', 
                      fontWeight: sortField === 'category' ? 'bold' : 'normal',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    Kategoria{renderSortArrow('category')}
                  </TableCell>
                  <TableCell 
                    onClick={() => onSortChange('amount')}
                    sx={{ 
                      cursor: 'pointer', 
                      fontWeight: sortField === 'amount' ? 'bold' : 'normal',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    Ilość{renderSortArrow('amount')}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Opis</TableCell>
                  <TableCell align="right" className="no-print">Akcje</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allIngredients.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Typography variant="body1" fontWeight="medium" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {item.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Chip 
                        label={item.categoryName} 
                        size="small"
                        color={getCategoryColor(item.category)}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      {item.amount ? `${item.amount} ${item.unit || ''}` : '-'}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{item.description || '-'}</TableCell>
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
            <Typography variant="subtitle1" sx={{ mr: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Sortuj po:</Typography>
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
              size="small"
            />
          </Box>
          
          <Grid container spacing={1.5}>
            {allIngredients.map(item => (
              <Grid item xs={12} key={item.id}>
                <Card elevation={2}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="h6" component="div" gutterBottom sx={{ fontSize: '1rem', mb: 0.5 }}>
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
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                      <strong>Ilość:</strong> {item.amount ? `${item.amount} ${item.unit || ''}` : 'Nie określono'}
                    </Typography>
                    {item.description && (
                      <Typography variant="body2" sx={{ mt: 1, fontSize: '0.75rem' }}>
                        <strong>Opis:</strong> {item.description}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Print view - specjalny widok do druku */}
        <Box className="print-only" sx={{ display: 'none' }}>
          {Object.entries(ingredients).map(([category, items]) => 
            items.length > 0 && (
              <Box key={category} className="print-category">
                <Typography variant="h5" gutterBottom className="print-category-title">
                  {getCategoryName(category)} ({items.length})
                </Typography>
                
                {items.map(item => (
                  <Box key={item.id} className="print-card">
                    <Typography className="print-card-title">{item.name}</Typography>
                    <Box className="print-card-category">{getCategoryName(category)}</Box>
                    
                    <Box className="print-card-details">
                      <Typography>
                        <strong>Ilość:</strong> {item.amount ? `${item.amount} ${item.unit || ''}` : 'Nie określono'}
                      </Typography>
                      {item.description && (
                        <Typography>
                          <strong>Opis:</strong> {item.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            )
          )}
          
          <Box className="print-footer">
            Strona <span className="page-number"></span>
          </Box>
        </Box>
      </div>
    </>
  );
}

export default AllIngredientsList;
