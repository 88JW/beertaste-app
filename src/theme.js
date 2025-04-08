import { createTheme } from '@mui/material/styles';

// Utworzenie niestandardowego motywu dla aplikacji
const theme = createTheme({
  palette: {
    primary: {
      main: '#ff8f00', // Kolor bursztynowy pasujący do tematu piwa
      light: '#ffc046',
      dark: '#c56000',
      contrastText: '#fff',
    },
    secondary: {
      main: '#795548', // Brązowy kolor (jak butelki po piwie)
      light: '#a98274',
      dark: '#4b2c20',
      contrastText: '#fff',
    },
    warning: {
      main: '#f57c00', // Orange for warnings
    },
    success: {
      main: '#43a047', // Green for success messages
    },
    error: {
      main: '#d32f2f', // Red for errors
    },
    background: {
      default: '#fafafa',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none', // Avoid all-uppercase buttons
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
