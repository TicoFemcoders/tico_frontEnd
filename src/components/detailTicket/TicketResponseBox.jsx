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
      ticketId: Number(ticketId), 
      content: text,  
      recipientId: null
    };
    try {
      await ticketMessageService.createMessage(ticketId, messageRequestDTO);
      setText(""); 
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (err) {
      setError("No se pudo enviar la respuesta. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ 
      p: 3, 
      width: '100%',
      boxSizing: 'border-box', 
      boxShadow: 'var(--shadow)',
      border: '1px solid',
      borderColor: 'var(--border)',
      bgcolor: 'background.paper',
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
        sx={{
        "& .MuiOutlinedInput-root": {
          color: "var(--text)",
          "& fieldset": { borderColor: "var(--border)" },
          "&:hover fieldset": { borderColor: "primary.main" },
          }
        }}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSend}
          disabled={loading || !text.trim()}
          sx={{ fontWeight: 'bold', '&:hover': { bgcolor: 'primary.dark',} }}
        >
          {loading ? "Enviando..." : "Enviar respuesta"}
        </Button>
      </Box>
    </Paper>
  );
};

export default TicketResponseBox;