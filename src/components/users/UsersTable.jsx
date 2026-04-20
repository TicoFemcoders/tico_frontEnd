import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import UserAvatar from "../common/UserAvatar";

const UsersTable = ({ users, onDelete, onEdit }) => {
    return (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "none", border: "1px solid #e5e7eb" }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Rol</TableCell>
                        <TableCell>Tickets abiertos</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} hover>
                            <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <UserAvatar name={user.name} role={user.role} />
                                    {user.name}
                                </Box>
                            </TableCell>
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
                            <TableCell>
                                <Button size="small" sx={{ color: "#f28a2e", mr: 1 }} onClick={() => onEdit(user)}>
                                    Editar
                                </Button>
                                <Button size="small" sx={{ color: "#ef4444" }} onClick={() => onDelete(user.id)}>
                                    Eliminar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UsersTable;