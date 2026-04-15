import { Paper, TextField, Button } from "@mui/material";

const TicketResponseBox = () => {
  return (
    <Paper sx={{ p: 2 }}>
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Escribe una respuesta..."
      />

      <Button variant="contained" sx={{ mt: 2 }}>
        Enviar
      </Button>
    </Paper>
  );
};

export default TicketResponseBox;