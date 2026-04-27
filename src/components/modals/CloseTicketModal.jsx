import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { closeTicket } from "../../services/ticketService";
import AppModal from "../common/AppModal";

export default function CloseTicketModal({ open, onClose, ticket, onSuccess }) {
  const [closingMessage, setClosingMessage] = useState("");
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState("");

  const handleClose = () => {
    setClosingMessage("");
    setError("");
    onClose();
  };

  const handleConfirm = async () => {
    setError("");
    setLoading(true);
    try {
      await closeTicket(ticket.id, closingMessage || "");
      onSuccess?.();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al cerrar el ticket. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!ticket) return null;

  return (
    <AppModal
        open={open}
        onClose={handleClose}
        title={`Cerrar ticket ${ticket.emailSubject?.split("]")[0] + "]"}`}
        maxWidth="sm"
        actions={
            <>
                <Button variant="outlined" onClick={handleClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button variant="contained" onClick={handleConfirm} disabled={loading} sx={{ fontWeight: 600 }}>
                    {loading ? <CircularProgress size={18} color="inherit" /> : "Cerrar ticket"}
                </Button>
            </>
        }
    >
        <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 3 }}>
            Al cerrar el ticket se enviará un email automático a{" "}
            <Box component="strong" sx={{ color: "text.primary" }}>
                {ticket.createdByName || "el usuario"}
            </Box>{" "}
            confirmando la resolución.
        </Typography>

        <Box component="label" sx={{ display: "block", fontSize: 13, fontWeight: 600, color: "text.primary", mb: "6px" }}>
            Mensaje de cierre (obligatorio)
        </Box>
        <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Ej: Problema resuelto. El servidor ha sido reiniciado correctamente..."
            value={closingMessage}
            onChange={(e) => setClosingMessage(e.target.value)}
            slotProps={{ htmlInput: { maxLength: 500 } }}
        />
        {error && (
            <Alert severity="error" sx={{ mt: 2, fontSize: 13 }}>
                {error}
            </Alert>
        )}
    </AppModal>
);
}