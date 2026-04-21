import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { useState } from "react";

const CreateUserModal = ({ open, onClose, onConfirm }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: ["EMPLOYEE"],
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        // TODO: validaciones
        onConfirm(formData);
        setFormData({ name: "", email: "", role: ["EMPLOYEE"] });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h6" fontWeight={700}>Crear Usuario</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Rellena los datos del nuevo usuario
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
                    placeholder="Ana García"
                />
                <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    placeholder="ana@cohispania.com"
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
                    Crear Usuario
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateUserModal;