import { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import PageHeader from "../components/common/PageHeader";
import UsersTable from "../components/users/UsersTable";
import CreateUserModal from "../components/users/CreateUserModal";
import EditUserModal from "../components/users/EditUserModal";
import DeleteUserModal from "../components/users/DeleteUserModal";
import { useUsers } from "../hooks/useUsers";

const UsersPage = () => {
    const { users, loading, createUser, updateUser, deleteUser, handleError } = useUsers();
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen]     = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser]       = useState(null);

    const handleEditClick = (user) => { setSelectedUser(user); setEditModalOpen(true); };
    const handleDeleteClick = (user) => { setSelectedUser(user); setDeleteModalOpen(true); };

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
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />

            <CreateUserModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onCreate={createUser}
                onError={handleError}
            />

            <EditUserModal
                open={editModalOpen}
                onClose={() => { setEditModalOpen(false); setSelectedUser(null); }}
                onEdit={updateUser}
                onError={handleError}
                user={selectedUser}
            />

            <DeleteUserModal
                open={deleteModalOpen}
                onClose={() => { setDeleteModalOpen(false); setSelectedUser(null); }}
                onDelete={deleteUser}
                onError={handleError}
                user={selectedUser}
            />
        </Box>
    );
};

export default UsersPage;