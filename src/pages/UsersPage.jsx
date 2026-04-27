import React, { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import PageHeader from "../components/common/PageHeader";
import UsersTable from "../components/users/UsersTable";
import CreateUserModal from "../components/users/CreateUserModal";
import EditUserModal from "../components/users/EditUserModal";
import DeleteUserModal from "../components/users/DeleteUserModal";
import { useUsers } from "../hooks/useUsers";
import LoadingScreen from "../components/common/LoadingScreen";

const UsersPage = () => {
    const {
        activeUsers,
        inactiveUsers,
        loading,
        isSyncing,
        createUser,
        updateAndToggleUser,
        deactivateUser,
        handleError,
    } = useUsers();

    const [createModalOpen, setCreateModalOpen]     = useState(false);
    const [editModalOpen, setEditModalOpen]         = useState(false);
    const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
    const [selectedUser, setSelectedUser]           = useState(null);
    const [userToDeactivate, setUserToDeactivate]   = useState(null);

    const handleEditClick   = (user) => { setSelectedUser(user); setEditModalOpen(true); };

    const handleNeedsReassign = (user) => {
        setEditModalOpen(false);
        setUserToDeactivate(user);
        setDeactivateModalOpen(true);
    };

    const handleDeactivate = async (userId, reassignEmail) => {
        try {
            await deactivateUser(userId, reassignEmail);
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
           { loading ? (
            <LoadingScreen />
        ) : (
            <>
                <PageHeader
                    title="Gestión de Usuarios"
                    subtitle={isSyncing ? "Sincronizando usuarios en segundo plano..." : "Administra los empleados y sus permisos"}
                    actionText="Crear Usuario"
                    onActionClick={() => setCreateModalOpen(true)}
                    breadcrumbs={["Usuarios"]}
                />

                <UsersTable
                    title="Usuarios activos"
                    users={activeUsers}
                    onEdit={handleEditClick}
                />

                <UsersTable
                    title="Usuarios inactivos"
                    users={inactiveUsers}
                    onEdit={handleEditClick}
                />
            </>
        )}

            <CreateUserModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onCreate={createUser}
                onError={handleError}
            />

            <EditUserModal
                open={editModalOpen}
                onClose={() => { setEditModalOpen(false); setSelectedUser(null); }}
                onEdit={updateAndToggleUser}
                onNeedsReassign={handleNeedsReassign}
                onError={handleError}
                user={selectedUser}
            />

            <DeleteUserModal
                mode="deactivate"
                open={deactivateModalOpen}
                onClose={() => { setDeactivateModalOpen(false); setUserToDeactivate(null); }}
                onDeactivate={handleDeactivate}
                onError={handleError}
                user={userToDeactivate}
            />
        </Box>
    
);};

export default UsersPage;
