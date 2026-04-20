import { Paper, TextField, Button, Box, Alert, Snackbar } from "@mui/material";
import { useState } from "react";
import { ticketMessageService } from "../../services/ticketMessageService"; // Asegúrate de la ruta
import useAuth from "../../context/useAuth";

const TicketResponseBox = ({ ticketId, onMessageSent }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleSend = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    const messageRequestDTO = {
      content: text,
      isInternal: false,
      authorId: user.id
    };

    try {
      await ticketMessageService.createMessage(ticketId, messageRequestDTO);
      setText(""); 
      
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (err) {
      setError("No se pudo enviar la respuesta. Inténtalo de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ 
      p: 3, 
      width: '100%',
      boxSizing: 'border-box', 
      borderRadius: 2, 
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper'
    }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="Escribe una respuesta..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
        variant="outlined"
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSend}
          disabled={loading || !text.trim()}
          sx={{ fontWeight: 700, textTransform: 'none', px: 4 }}
        >
          {loading ? "Enviando..." : "Enviar respuesta"}
        </Button>
      </Box>
    </Paper>
  );
};

export default TicketResponseBox;