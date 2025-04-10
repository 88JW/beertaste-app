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
    .print-only {
      display: block !important;
    }
    
    /* Ulepszony wygląd nagłówka */
    .print-header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 2px solid #333;
      padding-bottom: 10px;
    }
    
    /* Style dla tabeli */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    
    th, td {
      border: 1px solid #ddd;
      padding: 8px 12px;
      text-align: left;
    }
    
    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    
    /* Style dla kart na wydruku */
    .print-card {
      border: 1px solid #ddd;
      margin-bottom: 10px;
      padding: 10px;
      page-break-inside: avoid;
    }
    
    .print-card-title {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 5px;
    }
    
    .print-card-category {
      background-color: #f5f5f5;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
      display: inline-block;
      margin-bottom: 5px;
    }
    
    .print-card-details {
      font-size: 12px;
      margin-top: 5px;
    }
    
    /* Ustawienia strony */
    @page {
      size: portrait;
      margin: 2cm;
    }
    
    /* Automatyczne łamanie stron między kategoriami */
    .print-category {
      page-break-before: always;
    }
    
    .print-category:first-of-type {
      page-break-before: avoid;
    }
    
    /* Stopka z numeracją stron */
    .print-footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    
    /* Ukryj elementy MUI, które nie potrzebujemy na wydruku */
    .MuiPaper-root {
      box-shadow: none !important;
      border: none !important;
    }
    
    .MuiTableCell-root {
      padding: 8px 16px;
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
