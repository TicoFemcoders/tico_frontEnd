import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, Alert, Checkbox, FormControlLabel, Box } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AppModal from "../common/AppModal";
import { getRole } from "../../utils/userHelpers";

const DeactivateUserModal = ({ open, onClose, user, onDeactivate, onError}) => {
    const [reassignEmail, setReassignEmail] = useState("");
    const [wantsToReassign, setWantsToReassign] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) { setReassignEmail(""); setError(""); }
    }, [open]);

    if (!user) return null;

    const hasActiveTickets = user.openTickets > 0;

    const handleConfirm = async () => {
        const isAdmin = getRole(user) === "ADMIN";
        const requiresEmail = hasActiveTickets && (isAdmin || wantsToReassign);




        if (requiresEmail && !reassignEmail.trim()) {
            setError("Introduce el email del empleado que recibirá los tickets.");
            return;
        }
        try {
            const finalEmail = requiresEmail ? reassignEmail.trim() : null;
            await onDeactivate(user.id, finalEmail);
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
                getRole(user) === "ADMIN" ? (
                <>
                    <Alert severity="warning" icon={<WarningAmberIcon fontSize="small" />} sx={{ mb: 2 }}>
                        Este administrador tiene <strong>{user.openTickets} tickets abiertos</strong>. Debes
                        reasignarlos a otro empleado para poder desactivarlo.
                    </Alert>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        Email del administrador que recibirá los tickets
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
                <>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Este empleado reportó <strong>{user.openTickets} tickets</strong> que aún no se han resuelto.
                        </Alert>
                        
                        <FormControlLabel
                            control={
                                <Checkbox 
                                    checked={wantsToReassign} 
                                    onChange={(e) => { setWantsToReassign(e.target.checked); setError(""); }} 
                                />
                            }
                            label="Reasignar la propiedad de estos tickets a otra persona"
                        />
                        {wantsToReassign && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Email del nuevo propietario
                                </Typography>
                                <TextField
                                    fullWidth size="small"
                                    placeholder="jefe@cohispania.com"
                                    value={reassignEmail}
                                    onChange={(e) => { setReassignEmail(e.target.value); setError(""); }}
                                    type="email"
                                    error={!!error}
                                />
                            </Box>
                        )}
                    </>
                )
            ) : (
                <Typography variant="body1" color="text.secondary">
                        "Este usuario no tiene tickets activos. Puedes desactivarlo directamente."
                </Typography>
            )}

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </AppModal>
    );
};

export default DeactivateUserModal;
