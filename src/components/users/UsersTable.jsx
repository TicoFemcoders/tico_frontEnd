import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import UserAvatar from "../common/UserAvatar";
import DataTable from "../common/DataTable";

const UsersTable = ({ users, onDelete, onEdit }) => {

    const columns = [
        {
            header: "Nombre",
            renderCell: (user) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <UserAvatar name={user.name} role={user.role} />
                    {user.name}
                </Box>
            ),
        },
        {
            header: "Email",
            renderCell: (user) => user.email,
        },
        {
            header: "Rol",
            renderCell: (user) => (
                <Chip
                    label={user.role === "EMPLOYEE" ? "Empleado" : "Admin"}
                    size="small"
                    sx={{
                        bgcolor: user.role === "ADMIN" ? "#dbeafe" : "#f3f4f6",
                        color: user.role === "ADMIN" ? "#1e40af" : "#374151",
                    }}
                />
            ),
        },
        {
            header: "Tickets abiertos",
            renderCell: (user) => `${user.openTickets} abiertos`,
        },
        {
            header: "Estado",
            renderCell: (user) => (
                <Chip
                    label={user.isActive ? "Activo" : "Inactivo"}
                    size="small"
                    sx={{
                        bgcolor: user.isActive ? "#d1fae5" : "#fee2e2",
                        color: user.isActive ? "#065f46" : "#991b1b",
                    }}
                />
            ),
        },
        {
            header: "Acciones",
            renderCell: (user) => (
                <>
                    <Button size="small" sx={{ color: "#f28a2e", mr: 1 }} onClick={() => onEdit(user)}>
                        Editar
                    </Button>
                    <Button size="small" sx={{ color: "#ef4444" }} onClick={() => onDelete(user.id)}>
                        Eliminar
                    </Button>
                </>
            ),
        },
    ];

    return <DataTable columns={columns} data={users} />;
};

export default UsersTable;