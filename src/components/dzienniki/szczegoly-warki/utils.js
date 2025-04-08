import { Timestamp } from 'firebase/firestore';

// Pomocnicza funkcja do bezpiecznego formatowania daty
export const formatDate = (timestamp) => {
  if (!timestamp) return "Brak daty";
  
  try {
    // Obsługa różnych formatów timestamp z Firestore
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    } else if (timestamp instanceof Date) {
      return timestamp.toLocaleString();
    } else if (typeof timestamp === 'string') {
      return new Date(timestamp).toLocaleString();
    } else if (typeof timestamp === 'number') {
      return new Date(timestamp).toLocaleString();
    }
    return "Format daty nieznany";
  } catch (error) {
    console.error("Błąd formatowania daty:", error);
    return "Błąd daty";
  }
};

// Funkcja do kalkulacji dni warzenia
export const calculateBrewingDays = (startDate) => {
  try {
    if (!startDate) return null;
    
    let brewDate;
    if (startDate.seconds) {
      brewDate = new Date(startDate.seconds * 1000);
    } else if (startDate instanceof Date) {
      brewDate = startDate;
    } else if (typeof startDate === 'string') {
      brewDate = new Date(startDate);
    } else {
      return null;
    }
    
    const today = new Date();
    const diffTime = Math.abs(today - brewDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (error) {
    console.error("Error calculating brewing days:", error);
    return null;
  }
};

// Style CSS dla wydruku
export const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    .print-content, .print-content * {
      visibility: visible;
    }
    .print-content {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    .no-print, .no-print * {
      display: none !important;
    }
    .page-break {
      page-break-before: always;
    }
  }
`;
