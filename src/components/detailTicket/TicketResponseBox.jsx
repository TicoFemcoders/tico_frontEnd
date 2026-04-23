import { Paper, TextField, Button, Box, Alert, Typography } from "@mui/material";
import { useState } from "react";
import { ticketMessageService } from "../../services/ticketMessageService";
import{ useAuth } from "../../context/useAuth";

const TicketResponseBox = ({ ticket, onMessageSent }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const isClosed = ticket?.status === "CLOSED";
  const ticketId = ticket?.id;

  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  const isAssignedAdmin = isAdmin && ticket?.assignedToName === user?.name;
  const isCreator = !isAdmin && ticket?.createdByName === user?.name;
  const canRespond = isCreator || isAssignedAdmin;

  if (!canRespond) return null;

  const handleSend = async () => {
    if (!text.trim()) return;
    if (!ticketId) {
      setError("Error interno: No se pudo identificar el ticket.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const messageRequestDTO = {
      ticketId: Number(ticketId),
      content: text,
      recipientId: null,
    };

    try {
      await ticketMessageService.createMessage(ticketId, messageRequestDTO);
      setText("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      if (onMessageSent) onMessageSent();
    } catch (err) {
      console.error("Error en la petición:", err);
      setError("No se pudo enviar la respuesta. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{
      p: 3,
      width: "100%",
      boxSizing: "border-box",
      boxShadow: "var(--shadow)",
      border: "1px solid",
      borderColor: isClosed ? "error.light" : "var(--border)",
      bgcolor: isClosed ? "var(--code-bg)" : "background.paper",
    }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>¡Mensaje enviado correctamente!</Alert>}

      {isClosed && (
        <Typography variant="body2" color="error" sx={{ mb: 2, fontWeight: 700 }}>
          TICKET CERRADO: No se pueden enviar más mensajes.
        </Typography>
      )}

      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder={isClosed ? "Conversación finalizada" : "Escribe una respuesta..."}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading || isClosed}
        variant="outlined"
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={loading || isClosed || !text.trim()}
          sx={{ fontWeight: "bold", textTransform: "none", px: 4 }}
        >
          {loading ? "Enviando..." : isClosed ? "Cerrado" : "Enviar respuesta"}
        </Button>
      </Box>
    </Paper>
  );
};

export default TicketResponseBox;