import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";


const mockUsers = [
    { id: 1, name: "Ana García", email: "ana@cohispania.com", role: "ADMIN", isActive: true, openTickets: 0 },
    { id: 2, name: "Luis Martínez", email: "luis@cohispania.com", role: "EMPLOYEE", isActive: true, openTickets: 3 },
    { id: 3, name: "María López", email: "maria@cohispania.com", role: "EMPLOYEE", isActive: false, openTickets: 1 },
];

const UsersPage = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h1">
                        Gestión de Usuarios
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary", mt: 0.5 }}>
                        Administra los empleados y sus permisos
                    </Typography>
                </Box>
                <Button variant="contained" color="primary">
                    + Crear Usuario
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "none", border: "1px solid #e5e7eb" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Tickets abiertos</TableCell>
                            <TableCell>Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockUsers.map((user) => (
                            <TableRow key={user.id} hover>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>

                                    <Chip
                                        label={user.role === "EMPLOYEE" ? "Empleado" : "Admin"}
                                        size="small"
                                        sx={{
                                            bgcolor: user.role === "ADMIN" ? "#dbeafe" : "#f3f4f6",
                                            color: user.role === "ADMIN" ? "#1e40af" : "#374151",
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{user.openTickets} abiertos</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.isActive ? "Activo" : "Inactivo"}
                                        size="small"
                                        sx={{
                                            bgcolor: user.isActive ? "#d1fae5" : "#fee2e2",
                                            color: user.isActive ? "#065f46" : "#991b1b",
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UsersPage;