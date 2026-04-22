import { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import UserAvatar from "../common/UserAvatar";
import DataTable from "../common/DataTable";
import TableToolbar from "../common/TableToolbar";

const UsersTable = ({ users, onDelete, onEdit }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("");

    const sortOptions = [
        { value: "", label: "Todos" },
        { value: "ACTIVE", label: "Activo" },
        { value: "INACTIVE", label: "Inactivo" },
    ];

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSort = sortOption === "" || 
            (sortOption === "ACTIVE" && user.isActive) || 
            (sortOption === "INACTIVE" && !user.isActive);
        return matchesSearch && matchesSort;
    });

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
                        bgcolor: user.role === "ADMIN" ? "status.open.bg" : "background.default",
                        color: user.role === "ADMIN" ? "blueAccent.main" : "text.mid",
                    }}
                />
            ),
        },
        {
            header: "Tickets abiertos",
            renderCell: (user) => `${user.openTickets ?? 0} abiertos`,
        },
        {
            header: "Estado",
            renderCell: (user) => (
                <Chip
                    label={user.isActive ? "Activo" : "Inactivo"}
                    size="small"
                    sx={{
                        bgcolor: user.isActive ? "status.closed.bg" : "status.open.bg",
                        color: user.isActive ? "status.closed.text" : "error.main",
                    }}
                />
            ),
        },
        {
            header: "Acciones",
            renderCell: (user) => (
                <>
                    <Button size="small" sx={{ color: "primary.main", mr: 1 }} onClick={() => onEdit(user)}>
                        Editar
                    </Button>
                    <Button size="small" sx={{ color: "error.main" }} onClick={() => onDelete(user.id)}>
                        Eliminar
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Box>
            <TableToolbar
                title="Tickets activos"
                showFilter={true}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Buscar usuario..."
                sortOption={sortOption}
                onSortChange={setSortOption}
                sortOptions={sortOptions}
            />
            <DataTable columns={columns} data={filteredUsers} />
        </Box>
    );
};

export default UsersTable;