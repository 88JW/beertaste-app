import React from 'react';
import { Box } from '@mui/material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          mt: { xs: 1, sm: 1.5 }
        }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default TabPanel;
