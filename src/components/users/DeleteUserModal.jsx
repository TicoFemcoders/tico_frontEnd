import { useState, useEffect } from "react";
import { Typography, TextField, Button, Alert } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AppModal from "../common/AppModal";

const DeleteUserModal = ({ open, onClose, user, onDeactivate, onError}) => {
    const [reassignEmail, setReassignEmail] = useState("");
    const [error, setError]                 = useState("");

    useEffect(() => {
        if (!open) { setReassignEmail(""); setError(""); }
    }, [open]);

    if (!user) return null;

    const hasActiveTickets = user.openTickets > 0;

    const handleConfirm = async () => {
        if (hasActiveTickets && !reassignEmail.trim()) {
            setError("Introduce el email del empleado que recibirá los tickets.");
            return;
        }
        try {
                await onDeactivate(user.id, reassignEmail.trim() || null);
            onClose();
        } catch (err) {
            onError(err);
        }
    };

    return (
        <AppModal
            open={open}
            onClose={onClose}
            title= "Desactivar usuario"
            maxWidth="xs"
            actions={
                <>
                    <Button color="inherit" onClick={onClose}>Cancelar</Button>
                    <Button variant="contained" color="error" onClick={handleConfirm}>
                        {hasActiveTickets ? "Reasignar y desactivar" : "Desactivar usuario"}
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
                        reasignarlos a otro empleado para poder desactivarlo.
                    </Alert>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        Email del empleado que recibirá los tickets
                    </Typography>
                    <TextField
                        fullWidth size="small"
                        placeholder="empleado@cohispania.com"
                        value={reassignEmail}
                        onChange={(e) => { setReassignEmail(e.target.value); setError(""); }}
                        type="email"
                        error={!!error}
                    />
                </>
            ) : (
                <Typography variant="body1" color="text.secondary">
                        "Este usuario no tiene tickets activos. Puedes desactivarlo directamente."
                </Typography>
            )}

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </AppModal>
    );
};

export default DeleteUserModal;
