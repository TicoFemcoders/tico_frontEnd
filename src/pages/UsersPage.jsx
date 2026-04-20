import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import PageHeader from "../components/common/PageHeader";
import UsersTable from "../components/users/UsersTable";
import DeleteUserModal from "../components/users/DeleteUserModal";
import CreateUserModal from "../components/users/CreateUserModal";
import { getAllUsers, deleteUser } from "../services/userService";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getAllUsers();
            setUsers(data);
        };
        fetchUsers();
    }, []);

    const handleDeleteClick = (id) => {
        const user = users.find((u) => u.id === id);
        setSelectedUser(user);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        // await deleteUser(selectedUser.id);
        // setUsers(users.filter((u) => u.id !== selectedUser.id));
        console.log("Eliminar usuario:", selectedUser);
        setDeleteModalOpen(false);
        setSelectedUser(null);
    };

    const handleEdit = (user) => {
        // TODO: abrir modal de edición
        console.log("Editar usuario:", user);
    };

    const handleCreateConfirm = async (formData) => {
        // await createUser(formData);
        console.log("Crear usuario:", formData);
        setCreateModalOpen(false);
    };

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
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                user={selectedUser}
                onConfirm={handleDeleteConfirm}
            />
            <CreateUserModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onConfirm={handleCreateConfirm}
            />
        </Box>
    );
};

export default UsersPage;