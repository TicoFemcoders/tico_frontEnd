import { useState, useEffect } from "react";
import { Box, TextField, MenuItem, Button, Typography } from "@mui/material";
import AppModal from "../common/AppModal";

const EditUserModal = ({ open, onClose, onEdit, onError, onToggle, onNeedsReassign, user }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        roles: ["EMPLOYEE"],
        isActive: true,
    });

    useEffect(() => {
        if (user) setFormData({
            name: user.name || "",
            email: user.email || "",
            roles: [
                (Array.isArray(user.roles) ? user.roles[0] : user.roles || "EMPLOYEE")
                    .replace("ROLE_", "")
            ],
            isActive: user.isActive ?? true,
        });
    }, [user]);

    const handleSubmit = async () => {
        const deactivating = user.isActive && !formData.isActive;
        const statusChanging = user.isActive !== formData.isActive;

        if (deactivating && user.openTickets > 0) {
            onNeedsReassign(user);
            return;
        }

        try {
            await onEdit(user.id, { name: formData.name, email: formData.email, roles: formData.roles });
            if (statusChanging) await onToggle(user.id);
            onClose();
        } catch (err) {
            onError(err);
        }
    };

    return (
        <AppModal
            open={open}
            onClose={onClose}
            title="Editar Usuario"
            maxWidth="sm"
            actions={
                <>
                    <Button color="inherit" onClick={onClose}>Cancelar</Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Guardar Cambios</Button>
                </>
            }
        >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Modifica los datos del usuario
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    label="Nombre"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    fullWidth size="small"
                    placeholder="Ana García"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    fullWidth size="small"
                    placeholder="ana@cohispania.com"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Rol"
                    value={formData.roles?.[0] ?? "EMPLOYEE"}
                    onChange={(e) => setFormData({ ...formData, roles: [e.target.value] })}
                    fullWidth size="small" select
                    InputLabelProps={{ shrink: true }}
                >
                    <MenuItem value="EMPLOYEE">Empleado</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                </TextField>
                <TextField
                    label="Estado"
                    value={formData.isActive ? "ACTIVE" : "INACTIVE"}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "ACTIVE" })}
                    fullWidth size="small" select
                    InputLabelProps={{ shrink: true }}
                >
                    <MenuItem value="ACTIVE">Activo</MenuItem>
                    <MenuItem value="INACTIVE">Inactivo</MenuItem>
                </TextField>
            </Box>
        </AppModal>
    );
};

export default EditUserModal;
