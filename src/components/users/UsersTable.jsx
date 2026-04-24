import { useState } from "react";
import { Paper, Box } from "@mui/material";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import { DeleteOutlined as DeleteOutlinedIcon } from "@mui/icons-material";
import UserAvatar from "../common/UserAvatar";
import DataTable from "../common/DataTable";
import TableToolbar from "../common/TableToolbar";

const getRole = (user) => {
    const role = Array.isArray(user.roles) ? user.roles[0] : user.role;
    return role?.replace("ROLE_", "") || "EMPLOYEE";
};

const roleOptions = [
    { value: "", label: "Todos" },
    { value: "EMPLOYEE", label: "Empleado" },
    { value: "ADMIN", label: "Admin" },
];

const actionLinkSx = (color) => ({
    textDecoration: "none",
    fontWeight: 700,
    color,
    fontSize: "12px",
    border: "none",
    bgcolor: "transparent",
    cursor: "pointer",
});

const UsersTable = ({ users, onDelete, onEdit, title = "Usuarios" }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter]   = useState("");

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "" || getRole(user) === roleFilter;
        return matchesSearch && matchesRole;
    });

    const columns = [
        {
            header: "Nombre",
            renderCell: (user) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <UserAvatar name={user.name} role={getRole(user)} />
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
            renderCell: (user) => {
                const role = getRole(user);
                return (
                    <Chip
                        label={role === "ADMIN" ? "Admin" : "Empleado"}
                        size="small"
                        sx={{
                            bgcolor: role === "ADMIN" ? "status.open.bg" : "background.default",
                            color: role === "ADMIN" ? "blueAccent.main" : "text.mid",
                        }}
                    />
                );
            },
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
                        bgcolor: user.isActive ? "status.closed.bg" : "priority.urgent.bg",
                        color: user.isActive ? "status.closed.text" : "error.main",
                    }}
                />
            ),
        },
        {
            header: "Acciones",
            renderCell: (user) => (
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Link component="button" onClick={() => onEdit(user)} sx={actionLinkSx("primary.main")}>
                        EDITAR
                    </Link>
                    <IconButton
                        size="small"
                        onClick={() => onDelete(user)}
                        sx={{ color: "error.main", p: 0.5 }}
                    >
                        <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Paper sx={{ borderRadius: 2, boxShadow: 1, mb: 4, overflow: "hidden", bgcolor: "background.paper" }}>
            <TableToolbar
                title={title}
                showFilter={true}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Buscar por nombre o email..."
                sortOption={roleFilter}
                onSortChange={setRoleFilter}
                sortOptions={roleOptions}
            />
            <DataTable columns={columns} data={filteredUsers} itemsPerPage={10} />
        </Paper>
    );
};

export default UsersTable;
