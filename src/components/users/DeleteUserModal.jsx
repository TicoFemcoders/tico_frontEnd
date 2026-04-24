import { useState, useEffect } from "react";
import { Typography, TextField, Button, Alert } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AppModal from "../common/AppModal";

const DeleteUserModal = ({ open, onClose, user, onDelete, onDeactivate, onError, mode = "delete" }) => {
    const [reassignEmail, setReassignEmail] = useState("");
    const [error, setError]                 = useState("");

    const isDeactivate = mode === "deactivate";

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
            if (isDeactivate) {
                await onDeactivate(user.id, reassignEmail.trim() || null);
            } else {
                await onDelete(user.id, reassignEmail.trim() || null);
            }
            onClose();
        } catch (err) {
            onError(err);
        }
    };

    const confirmLabel = hasActiveTickets
        ? (isDeactivate ? "Reasignar y desactivar" : "Reasignar y eliminar")
        : (isDeactivate ? "Desactivar usuario" : "Eliminar usuario");

    return (
        <AppModal
            open={open}
            onClose={onClose}
            title={isDeactivate ? "Desactivar usuario" : "Eliminar usuario"}
            maxWidth="xs"
            actions={
                <>
                    <Button color="inherit" onClick={onClose}>Cancelar</Button>
                    <Button variant="contained" color="error" onClick={handleConfirm}>
                        {confirmLabel}
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
                        reasignarlos a otro empleado{isDeactivate ? " para poder desactivarlo" : " antes de continuar"}.
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
                    {isDeactivate
                        ? "Este usuario no tiene tickets activos. Puedes desactivarlo directamente."
                        : "Este usuario no tiene tickets activos. Puedes eliminarlo directamente."
                    }
                </Typography>
            )}

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </AppModal>
    );
};

export default DeleteUserModal;
