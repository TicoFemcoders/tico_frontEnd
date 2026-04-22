import React, { useState, useEffect } from "react";
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
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { deleteUser } from "../../services/userService";

export default function DeleteUserModal({ open, onClose, user, onSuccess }) {
    const [reassignEmail, setReassignEmail] = useState("");
    const [loading, setLoading]             = useState(false);
    const [error, setError]                 = useState("");

    useEffect(() => {
        if (!open) return;
        setReassignEmail("");
        setError("");
    }, [open]);

    if (!user) return null;

    const hasActiveTickets = user.openTickets > 0;

    const handleConfirm = async () => {
        if (hasActiveTickets && !reassignEmail.trim()) {
            setError("Introduce el email del empleado que recibirá los tickets.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            await deleteUser(user.id, reassignEmail.trim() || null);
            onSuccess?.();
            onClose();
        } catch (err) {
            setError(err.response?.data?.mensaje || "Error al eliminar el usuario. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>

            <DialogTitle sx={{ pb: 0.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "text.primary" }}>
                            Eliminar usuario
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.3 }}>
                            {user.name} · {user.email}
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={onClose} sx={{ mt: -0.5 }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                {hasActiveTickets ? (
                    <>
                        <Alert
                            severity="warning"
                            icon={<WarningAmberIcon fontSize="small" />}
                            sx={{ mb: 2, fontSize: 13 }}
                        >
                            Este empleado tiene{" "}
                            <strong>{user.openTickets} tickets abiertos</strong>. Debes
                            reasignarlos a otro empleado antes de continuar.
                        </Alert>

                        <Box component="label" sx={{ display: "block", fontSize: 13, fontWeight: 600, color: "text.primary", mb: "6px" }}>
                            Email del empleado que recibirá los tickets
                        </Box>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="empleado@cohispania.com"
                            value={reassignEmail}
                            onChange={(e) => setReassignEmail(e.target.value)}
                            type="email"
                            error={!!error}
                        />
                    </>
                ) : (
                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                        Este usuario no tiene tickets activos. Puedes eliminarlo directamente.
                    </Typography>
                )}

                {error && (
                    <Alert severity="error" sx={{ mt: 2, fontSize: 13 }}>
                        {error}
                    </Alert>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                <Button variant="outlined" onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleConfirm}
                    disabled={loading}
                    sx={{ fontWeight: 600 }}
                >
                    {loading
                        ? <CircularProgress size={18} color="inherit" />
                        : hasActiveTickets ? "Reasignar y eliminar" : "Eliminar usuario"
                    }
                </Button>
            </DialogActions>

        </Dialog>
    );
}