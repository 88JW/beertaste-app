// Funkcje pomocnicze do kategorii i jednostek

// Style dla drukowania
export const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    #print-content, #print-content * {
      visibility: visible;
    }
    #print-content {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    .no-print {
      display: none !important;
    }
    .MuiPaper-root {
      box-shadow: none !important;
      border: none !important;
    }
    .MuiTableCell-root {
      padding: 8px 16px;
    }
    @page {
      size: portrait;
      margin: 1cm;
    }
  }
`;

// Funkcja zwracająca nazwę kategorii
export const getCategoryName = (category) => {
  switch (category) {
    case 'slody': return 'Słód';
    case 'chmiele': return 'Chmiel';
    case 'drozdze': return 'Drożdże';
    case 'dodatki': return 'Dodatek';
    default: return category;
  }
};

// Funkcja zwracająca dostępne jednostki dla danej kategorii
export const getUnitOptions = (category) => {
  switch (category) {
    case 'slody':
      return ['kg', 'g'];
    case 'chmiele':
      return ['g', 'kg', 'oz'];
    case 'drozdze':
      return ['opakowanie', 'g', 'ml'];
    case 'dodatki':
      return ['g', 'kg', 'ml', 'l', 'szt'];
    default:
      return ['szt'];
  }
};

// Funkcja zwracająca kolor dla kategorii
export const getCategoryColor = (category) => {
  switch (category) {
    case 'slody': return 'warning';
    case 'chmiele': return 'success';
    case 'drozdze': return 'info';
    default: return 'default';
  }
};
