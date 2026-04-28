import { Paper, TextField, Button, Box, Alert, Typography } from "@mui/material";
import React, { useState } from "react";
import { ticketMessageService } from "../../services/ticketMessageService";
import{ useAuth } from "../../context/useAuth";
import { useSnackbar } from "notistack";

const TicketResponseBox = ({ ticket, onMessageSent }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const isClosed = ticket?.status === "CLOSED";
  const ticketId = ticket?.id;

  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  const isAssignedAdmin = isAdmin && ticket?.assignedToName === user?.name;
  const isCreator = !isAdmin && ticket?.createdByName === user?.name;
  const canRespond = isCreator || isAssignedAdmin;
 

  const handleSend = async () => {
    if (!text.trim()) return;
    if (!ticketId) {
      enqueueSnackbar("Error interno: No se pudo identificar el ticket.", { variant: "error" });
      return;
    }

    setLoading(true);

    const messageRequestDTO = {
      ticketId: Number(ticketId),
      content: text,
      recipientId: null,
    };

    try {
      await ticketMessageService.createMessage(ticketId, messageRequestDTO);
      setText("");
      enqueueSnackbar("¡Mensaje enviado correctamente!", { variant: "success" });
      if (onMessageSent) onMessageSent();
    } catch (err) {
      enqueueSnackbar(err.friendlyMessage, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return canRespond ? (
    <Paper sx={{
      p: 3,
      width: "100%",
      boxSizing: "border-box",
      boxShadow: "var(--shadow)",
      border: "1px solid",
      borderColor: isClosed ? "error.light" : "border.soft",
      bgcolor: isClosed ? "action.hover" : "background.paper",
    }}>

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
  ) : null;
};

export default TicketResponseBox;