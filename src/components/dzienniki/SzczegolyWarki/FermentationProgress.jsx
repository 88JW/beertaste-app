import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';

const FermentationProgress = ({ przebiegFermentacji, formatDate }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Data</TableCell>
          <TableCell>BLG</TableCell>
          <TableCell>Temperatura</TableCell>
          {/* ...other columns... */}
        </TableRow>
      </TableHead>
      <TableBody>
        {przebiegFermentacji.map((pomiar) => (
          <TableRow key={pomiar.id}>
            <TableCell>{formatDate(pomiar.dataPomiaru)}</TableCell>
            <TableCell>{pomiar.blg}</TableCell>
            <TableCell>{pomiar.temperatura}</TableCell>
            {/* ...other cells... */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default FermentationProgress;
