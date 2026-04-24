import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Alert, CircularProgress } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AppModal from "../common/AppModal";
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
        setLoading(true);
        try {
            await deleteUser(user.id, reassignEmail.trim() || null);
            onSuccess?.();
            onClose();
        } catch (err) {
            setError(err.friendlyMessage || "Error al eliminar el usuario.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppModal
            open={open}
            onClose={onClose}
            title="Eliminar usuario"
            maxWidth="xs"
            actions={
                <>
                    <Button variant="outlined" onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading
                            ? <CircularProgress size={18} color="inherit" />
                            : hasActiveTickets ? "Reasignar y eliminar" : "Eliminar usuario"
                        }
                    </Button>
                </>
            }
        >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {user.name} · {user.email}
            </Typography>

            {hasActiveTickets ? (
                <>
                    <Alert severity="warning" icon={<WarningAmberIcon fontSize="small" />} sx={{ mb: 2 }}>
                        Este empleado tiene <strong>{user.openTickets} tickets abiertos</strong>. Debes
                        reasignarlos a otro empleado antes de continuar.
                    </Alert>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        Email del empleado que recibirá los tickets
                    </Typography>
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
                <Typography variant="body1" color="text.secondary">
                    Este usuario no tiene tickets activos. Puedes eliminarlo directamente.
                </Typography>
            )}

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </AppModal>
    );
}