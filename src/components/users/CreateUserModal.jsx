<<<<<<< HEAD
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import React, { useState } from "react";
=======
import { useState } from "react";
import { Box, TextField, MenuItem, Button, Typography } from "@mui/material";
import AppModal from "../common/AppModal";
>>>>>>> c1485843a70afaa9b4c8dc17bb378ec6442b8907

const CreateUserModal = ({ open, onClose, onCreate, onError }) => {
    const [formData, setFormData] = useState({ name: "", email: "", roles: ["EMPLOYEE"] });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            await onCreate(formData);
            setFormData({ name: "", email: "", roles: ["EMPLOYEE"] });
            onClose();
        } catch (err) {
            onError(err);
        }
    };

    const handleClose = () => {
        setFormData({ name: "", email: "", roles: ["EMPLOYEE"] });
        onClose();
    };

    return (
        <AppModal
            open={open}
            onClose={handleClose}
            title="Crear Usuario"
            maxWidth="sm"
            actions={
                <>
                    <Button variant="outlined" onClick={handleClose}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSubmit}>Crear Usuario</Button>
                </>
            }
        >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Rellena los datos del nuevo usuario
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Nombre" name="name" value={formData.name}
                    onChange={handleChange} fullWidth size="small" placeholder="Ana García" />
                <TextField label="Email" name="email" value={formData.email}
                    onChange={handleChange} fullWidth size="small" placeholder="ana@cohispania.com" />
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

export default CreateUserModal;