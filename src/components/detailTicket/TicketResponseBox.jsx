import { Paper, TextField, Button, Box, Alert, Snackbar } from "@mui/material";
import { useState } from "react";
import { ticketMessageService } from "../../services/ticketMessageService"; // Asegúrate de la ruta
import useAuth from "../../context/useAuth";

const TicketResponseBox = ({ ticketId, onMessageSent }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  console.log("Datos del usuario logueado:", user);

  const handleSend = async () => {
    console.log("Enviando este DTO:", {
    authorId: user.id,
    ticketId: ticketId,
    content: text,
    isInternal: false
  });
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    const numericTicketId = parseInt(ticketId, 10);
    const numericAuthorId = parseInt(user.id, 10);
    const messageRequestDTO = {
      authorId: user.id, 
      ticketId: ticketId, 
      content: text,
      isInternal: false
    };
    console.log("Enviando DTO Validado:", messageRequestDTO);
    try {
      await ticketMessageService.createMessage(ticketId, messageRequestDTO);
      setText(""); 
      
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (err) {
      console.error("Error detallado:", err.response?.data);
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
          sx={{ fontWeight: 'bold' }}
        >
          {loading ? "Enviando..." : "Enviar respuesta"}
        </Button>
      </Box>
    </Paper>
  );
};

export default TicketResponseBox;