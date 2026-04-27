import { Box, TextField, MenuItem, Typography } from "@mui/material";

const UserForm = ({ formData, onChange, subtitle, showStatus = false }) => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {subtitle && (
            <Typography variant="body2" color="text.secondary">
                {subtitle}
            </Typography>
        )}
        <TextField
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={onChange}
            fullWidth
            size="small"
            placeholder="Ana García"
            InputLabelProps={{ shrink: true }}
        />
        <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={onChange}
            fullWidth
            size="small"
            placeholder="ana@cohispania.com"
            InputLabelProps={{ shrink: true }}
        />
        <TextField
            label="Rol"
            name="role"
            value={formData.roles?.[0] ?? "EMPLOYEE"}
            onChange={(e) => onChange({ target: { name: "roles", value: [e.target.value] } })}
            fullWidth
            size="small"
            select
            InputLabelProps={{ shrink: true }}
        >
            <MenuItem value="EMPLOYEE">Empleado</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
        </TextField>
        {showStatus && (
            <TextField
                label="Estado"
                name="status"
                value={formData.isActive ? "ACTIVE" : "INACTIVE"}
                onChange={(e) => onChange({ target: { name: "isActive", value: e.target.value === "ACTIVE" } })}
                fullWidth
                size="small"
                select
                InputLabelProps={{ shrink: true }}
            >
                <MenuItem value="ACTIVE">Activo</MenuItem>
                <MenuItem value="INACTIVE">Inactivo</MenuItem>
            </TextField>
        )}
    </Box>
);

export default UserForm;