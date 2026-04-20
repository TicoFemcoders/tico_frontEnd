import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import PageHeader from "../components/common/PageHeader";
import UsersTable from "../components/users/UsersTable";
import { getAllUsers, deleteUser } from "../services/userService";

const UsersPage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getAllUsers();
            setUsers(data);
        };
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        // await deleteUser(id);
        // setUsers(users.filter((u) => u.id !== id));
        console.log("Eliminar usuario:", id);
    };

    const handleEdit = (user) => {
        console.log("Editar usuario:", user);
    };

    return (
        <Box sx={{ p: 3 }}>
            <PageHeader
                title="Gestión de Usuarios"
                subtitle="Administra los empleados y sus permisos"
                actionText="Crear Usuario"
                onActionClick={() => console.log("Crear usuario")}
                breadcrumbs={["Usuarios"]}
            />
            <UsersTable
                users={users}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </Box>
    );
};

export default UsersPage;