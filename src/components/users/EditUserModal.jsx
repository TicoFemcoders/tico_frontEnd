import { useState, useEffect } from "react";
import { Box, TextField, MenuItem, Button, Typography } from "@mui/material";
import AppModal from "../common/AppModal";

const EditUserModal = ({ open, onClose, onEdit, onError, user }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        roles: ["EMPLOYEE"]
    });

    useEffect(() => {
        if (user) setFormData({
            name: user.name || "",
            email: user.email || "",
            roles: [
                (Array.isArray(user.roles) ? user.roles[0] : user.roles || "EMPLOYEE")
                    .replace("ROLE_", "")
            ],
        });
    }, [user]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            await onEdit(user.id, formData);
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
                    <Button variant="outlined" onClick={onClose}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSubmit}>Guardar Cambios</Button>
                </>
            }
        >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Modifica los datos del usuario
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Nombre" name="name" value={formData.name}
                    onChange={handleChange} fullWidth size="small" />
                <TextField label="Email" name="email" value={formData.email}
                    onChange={handleChange} fullWidth size="small" />
                <TextField
                    label="Rol"
                    name="roles"
                    value={formData.roles?.[0] ?? "EMPLOYEE"}
                    onChange={(e) => setFormData({ ...formData, roles: [e.target.value] })}
                    fullWidth size="small" select
                >
                    <MenuItem value="EMPLOYEE">Empleado</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                </TextField>
            </Box>
        </AppModal>
    );
};

export default EditUserModal;