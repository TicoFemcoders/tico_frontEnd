<<<<<<< HEAD
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
=======
import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Alert, CircularProgress } from "@mui/material";
>>>>>>> c1485843a70afaa9b4c8dc17bb378ec6442b8907
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