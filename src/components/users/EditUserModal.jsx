import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";

const EditUserModal = ({ open, onClose, onConfirm, user }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "EMPLOYEE",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                role: user.role || "EMPLOYEE",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        // TODO: validaciones
        onConfirm(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box>
                    <Typography variant="h6" fontWeight={700}>Editar Usuario</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Modifica los datos del usuario
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                <TextField
                    label="Nombre"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                />
                <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                />
                <TextField
                    label="Rol"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    select
                >
                    <MenuItem value="EMPLOYEE">Empleado</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                </TextField>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                <Button variant="outlined" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Guardar cambios
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditUserModal;