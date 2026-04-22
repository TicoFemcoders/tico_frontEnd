import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { requestPasswordReset } from "../../services/authService";

export default function ForgotPasswordModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (!email) return setError("Introduce tu correo electrónico.");

    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      const msg = err.response?.data?.message || "";
      setError(msg || "No se ha podido enviar el código. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError(null);
    setSent(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: "14px", width: "400px" } }}>
      <DialogTitle sx={{ fontSize: "16px", fontWeight: 700, color: "text.primary", pb: 0 }}>Recupera tu contraseña</DialogTitle>
      <DialogContent sx={{ pt: "12px !important" }}>
        {sent ? (
          <Alert severity="success" sx={{ fontSize: "13px" }}>
            Te hemos enviado un email con el link para restablecer tu contraseña.
          </Alert>
        ) : (
          <Box>
            <Box component="p" sx={{ fontSize: "13px", color: "text.secondary", mb: "16px", lineHeight: 1.5 }}>
              Introduce tu email corporativo y te enviaremos las instrucciones.
            </Box>
            {error && (
              <Alert severity="error" sx={{ mb: 2, fontSize: "13px" }}>
                {error}
              </Alert>
            )}
            <TextField id="forgot-email" fullWidth type="email" placeholder="tu.nombre@cohispania.com" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus onKeyDown={(e) => e.key === "Enter" && handleSubmit()} inputProps={{ "aria-label": "Correo electrónico" }} />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: "24px", pb: "20px", gap: "8px" }}>
        <Button onClick={handleClose} variant="outlined" sx={{ fontSize: "13px" }}>
          {sent ? "Cerrar" : "Cancelar"}
        </Button>
        {!sent && (
          <Button onClick={handleSubmit} variant="contained" disabled={loading} sx={{ fontSize: "13px" }}>
            {loading ? <CircularProgress size={16} color="inherit" /> : "Enviar"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
