import { Paper, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Select, MenuItem, Link, Stack, TextField, InputAdornment } from "@mui/material";
import { ArrowForward as ArrowIcon, Update as UpdateIcon, CheckCircle as CheckIcon, AddCircle as AddIcon,  Search as SearchIcon } from "@mui/icons-material";
//import { StatusChip, PriorityChip } from "../common/TicketChips";
import { useState, useMemo } from "react";
import DataTable from "../common/DataTable";
import TableToolbar from "../common/TableToolbar";
import { useLocation, Link as RouterLink } from "react-router-dom";
import StatusChip from "../common/StatusChip";
import PriorityChip from "../common/PriorityChip";

const getLatestDateInfo = (ticket) => {
    const dates = [
        { label: 'Creado', value: new Date(ticket.createdAt), color: "dateStatus.created", icon: <AddIcon fontSize="inherit" /> },
        { label: 'Modificado', value: new Date(ticket.updatedAt), color: "dateStatus.updated", icon: <UpdateIcon fontSize="inherit" /> },
    ];
    if (ticket.closedAt) {
        dates.push({ label: 'Cerrado', value: new Date(ticket.closedAt), color: "dateStatus.closed", icon: <CheckIcon fontSize="inherit" /> });
    }
    const latest = dates.sort((a, b) => b.value - a.value)[0];
    return { ...latest, value: latest.value.toLocaleDateString() };
};

const TicketTable = ({ title, tickets, showFilter = false, variant = "default" }) => {
    const [sortOption, setSortOption] = useState("recent");
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();

    const processedTickets = useMemo(() => {
        let filtered = tickets;
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            filtered = tickets.filter(t => 
                t.title.toLowerCase().includes(query) || 
                t.id.toString().includes(query) 
            );
        }
        const sorted = [...filtered];
        const getMaxDate = (t) => Math.max(new Date(t.createdAt), new Date(t.updatedAt || t.createdAt));
        const priorityWeight = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        const statusWeight = {'OPEN':3, 'IN_PROGRESS':2, 'CLOSED': 1}
        const sorters = {
            recent:   (a, b) => getMaxDate(b) - getMaxDate(a),
            oldest:   (a, b) => getMaxDate(a) - getMaxDate(b),
            priority: (a, b) => (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0),
            status: (a,b) => (statusWeight[b.status]|| 0) - (statusWeight[a.status]|| 0)
        };
        if (sorters[sortOption]) {
            sorted.sort(sorters[sortOption]);
        }
        return sorted;
    }, [tickets, sortOption, searchQuery]);

    const columns = [
        { header: "ID", renderCell: (t) => <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: "13px" }}>TIC-{t.id}</Typography> },
        { header: "TÍTULO", renderCell: (t) => <Typography sx={{ fontWeight: 500, maxWidth: 250, color: 'text.primary', fontSize: "13px" }}>{t.title}</Typography> },
        ["assigned", "all"].includes(variant) && {
            header: "EMPLEADO", 
            renderCell: (t) => <Typography sx={{ fontWeight: 500, color: 'text.primary', fontSize: "13px" }}>{t.creator?.name || "Desconocido"}</Typography>
        },
        { 
            header: "ETIQUETAS", 
            renderCell: (t) => (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 180 }}>
                    {t.labels?.map((label, i) => (
                        <Chip key={i} label={label} size="small" variant="outlined" sx={{ fontSize: '10px', height: 20 }} />
                    ))}
                </Box>
            )
        },
        { header: "PRIORIDAD", renderCell: (t) => <PriorityChip priority={t.priority} /> },
        { header: "ESTADO", renderCell: (t) => <StatusChip status={t.status} /> },
        variant === "all" && {
            header: "ASIGNADO A",
            renderCell: (t) => <Typography sx={{ fontWeight: 500, color: 'text.primary', fontSize: "13px" }}>{t.assignedTo?.name || "Sin asignar"}</Typography>
        },
        {
            header: "ÚLTIMA ACTIVIDAD",
            renderCell: (t) => {
                const latestDate = getLatestDateInfo(t);
                return (
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: latestDate.color }}>
                        {latestDate.icon}
                        <Box>
                            <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, lineHeight: 1 }}>{latestDate.label}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{latestDate.value}</Typography>
                        </Box>
                    </Stack>
                )
            }
        },
        {
            align: "right",
            renderCell: (t) => (
                <Link component={RouterLink} to={`/tickets/${t.id}`} state={{ fromPath: location.pathname }} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", textDecoration: "none", fontWeight: 600, fontSize: "12px", color: "primary.main" }}>
                    {["assigned", "all"].includes(variant) ? "Gestionar" : "Ver"} <ArrowIcon sx={{ fontSize: 16, ml: 0.5 }} />
                </Link>
            )
        }
    ].filter(Boolean);

return (
        <Paper component="section" aria-label={`Tabla de ${title}`} sx={{ borderRadius: 2, boxShadow: 1, mb: 4, overflow: "hidden", width: '100%', bgcolor: 'background.paper' }}>
            <TableToolbar 
                title={title}
                showFilter={showFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Buscar ID o título..."
                sortOption={sortOption}
                onSortChange={setSortOption}
                sortOptions={[
                    { value: "recent", label: "Más recientes" },
                    { value: "oldest", label: "Más antiguos" },
                    { value: "priority", label: "Mayor prioridad" },
                    { value: "status", label: "Estado" }
                ]}
                totalItems={tickets.length}
            />
            <DataTable 
                columns={columns} 
                data={processedTickets} 
                 mobileRenderer={(ticket, index) => {
                    const latestDate = getLatestDateInfo(ticket);
                    return (
                        <Box component="article" key={ticket.id} sx={{ mb: index !== processedTickets.length - 1 ? 3 : 0, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'border.soft' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>TIC-{ticket.id}</Typography>
                                <StatusChip status={ticket.status} />
                            </Box>
                            
                            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>{ticket.title}</Typography>
                            
                            {["assigned", "all"].includes(variant) && (
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontSize: '11px' }}>
                                    Empleado: <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{ticket.creator?.name || "Desconocido"}</Box>
                                </Typography>
                            )}
                            
                            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2, gap: 0.5 }}>
                                {ticket.labels?.map((label, i) => (
                                    <Chip key={i} label={label} size="small" variant="outlined" sx={{ fontSize: '9px', height: 18 }} />
                                ))}
                                <PriorityChip priority={ticket.priority} />
                            </Stack>
                            
                            {variant === "all" && (
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontSize: '11px' }}>
                                    Asignado a: <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{ticket.assignedTo?.name || "Sin asignar"}</Box>
                                </Typography>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="caption" sx={{ color: latestDate.color, display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
                                    {latestDate.icon} {latestDate.label}: {latestDate.value}
                                </Typography>
                                <Link component={RouterLink} to={`/tickets/${ticket.id}`} state={{ fromPath: location.pathname }} sx={{ fontWeight: 700, fontSize: "11px" }}>
                                     {["assigned", "all"].includes(variant) ? "GESTIONAR" : "VER"}
                                </Link>
                            </Box>
                        </Box>
                    );
                }} 
            />
        </Paper>
    );
}
export default TicketTable;