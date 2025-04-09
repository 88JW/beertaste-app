import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText, Button
} from '@mui/material';

function DeleteConfirmationDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Potwierdź usunięcie</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Czy na pewno chcesz usunąć ten składnik? Tej operacji nie można cofnąć.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          Usuń
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmationDialog;
