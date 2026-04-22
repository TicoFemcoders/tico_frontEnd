import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteUserModal from "../components/modals/DeleteUserModal";
import CreateUserModal from "../components/users/CreateUserModal";
import EditUserModal from "../components/users/EditUserModal";
import { getAllUsers } from "../services/userService";
import { userService } from "../services/userService";
import PageHeader from "../components/common/PageHeader";
import UsersTable from "../components/users/UsersTable";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleDeleteClick = (id) => {
        const user = users.find((u) => u.id === id);
        setSelectedUser(user);
        setDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        // await deleteUser(selectedUser.id);
        // setUsers(users.filter((u) => u.id !== selectedUser.id));
        console.log("Eliminar usuario:", selectedUser);
        setDeleteModal(false);
        setSelectedUser(null);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditModalOpen(true);
    };

    const handleEditConfirm = async (formData) => {
        // await userService.updateUser(selectedUser.id, formData);
        console.log("Editar usuario:", formData);
        setEditModalOpen(false);
        setSelectedUser(null);
    };

    const handleCreateConfirm = async (formData) => {
        // await userService.createUser(formData);
        console.log("Crear usuario:", formData);
        setCreateModalOpen(false);
    };

    if (loading) return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Box sx={{ p: 3 }}>
            <PageHeader
                title="Gestión de Usuarios"
                subtitle="Administra los empleados y sus permisos"
                actionText="Crear Usuario"
                onActionClick={() => setCreateModalOpen(true)}
                breadcrumbs={["Usuarios"]}
            />
            <UsersTable
                users={users}
                onDelete={handleDeleteClick}
                onEdit={handleEdit}
            />
            <DeleteUserModal
                open={deleteModal}
                onClose={() => setDeleteModal(false)}
                user={selectedUser}
                onConfirm={handleDeleteConfirm}
            />
            <CreateUserModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onConfirm={handleCreateConfirm}
            />
            <EditUserModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onConfirm={handleEditConfirm}
                user={selectedUser}
            />
        </Box>
    );
};

export default UsersPage;


















//         <Box sx={{ p: 3 }}>
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//                 <Box>
//                     <Typography variant="h1">Gestión de Usuarios</Typography>
//                     <Typography variant="body1" sx={{ color: "text.secondary", mt: 0.5 }}>
//                         Administra los empleados y sus permisos
//                     </Typography>
//                 </Box>
//                 <Button variant="contained" color="primary">+ Crear Usuario</Button>
//             </Box>

//             <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "none", border: "1px solid", borderColor: "border.soft" }}>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell>Nombre</TableCell>
//                             <TableCell>Email</TableCell>
//                             <TableCell>Rol</TableCell>
//                             <TableCell>Tickets abiertos</TableCell>
//                             <TableCell>Estado</TableCell>
//                             <TableCell>Acciones</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {users.map((user) => (
//                             <TableRow key={user.id} hover>
//                                 <TableCell>
//                                     <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//                                         <Avatar sx={{
//                                             bgcolor: isAdmin(user.roles) ? "blueAccent.main" : "success.main",
//                                             width: 36, height: 36, fontSize: "0.85rem", fontWeight: 600
//                                         }}>
//                                             {getInitials(user.name)}
//                                         </Avatar>
//                                         {user.name}
//                                     </Box>
//                                 </TableCell>
//                                 <TableCell>{user.email}</TableCell>

//                                 <TableCell>
//                                     <Chip
//                                         label={isAdmin(user.roles) ? "Admin" : "Empleado"}
//                                         size="small"
//                                         sx={{
//                                             bgcolor: isAdmin(user.roles) ? "status.open.bg" : "background.default",
//                                             color: isAdmin(user.roles) ? "blueAccent.main" : "text.mid",
//                                         }}
//                                     />
//                                 </TableCell>
//                                 <TableCell>{user.openTickets} abiertos</TableCell>
//                                 <TableCell>
//                                     <Chip
//                                         label={user.isActive ? "Activo" : "Inactivo"}
//                                         size="small"
//                                         sx={{
//                                             bgcolor: user.isActive ? "status.closed.bg" : "status.open.bg",
//                                             color: user.isActive ? "status.closed.text" : "error.main",
//                                         }}
//                                     />
//                                 </TableCell>
//                                 <TableCell>
//                                     <Button size="small" sx={{ color: "primary.main", mr: 1 }}>
//                                         Editar
//                                     </Button>
//                                     <Button
//                                         size="small"
//                                         sx={{ color: "error.main" }}
//                                         onClick={() => { setSelectedUser(user); setDeleteModal(true); }}
//                                     >
//                                         Eliminar
//                                     </Button>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             <DeleteUserModal
//                 open={deleteModal}
//                 onClose={() => setDeleteModal(false)}
//                 user={selectedUser}
//                 onSuccess={() => { setDeleteModal(false); fetchUsers(); }}
//             />
//         </Box>
//     );
// };

