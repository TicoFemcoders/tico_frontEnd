import { Paper, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Select, MenuItem, Link, Stack, TextField, InputAdornment } from "@mui/material";
import { ArrowForward as ArrowIcon, Update as UpdateIcon, CheckCircle as CheckIcon, AddCircle as AddIcon,  Search as SearchIcon } from "@mui/icons-material";
import { StatusChip, PriorityChip } from "../common/TicketChips";
import { useState, useMemo } from "react";
import TableToolbar from "../common/TableToolbar";

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

            {/* Vista móvil */}
            <Box sx={{ display: { xs: 'block', sm: 'none' }, p: 2 }}>
                {processedTickets.map((ticket, index) => {
                    const latestDate = getLatestDateInfo(ticket);
                    return (
                        <Box key={ticket.id} component="article" sx={{ mb: index !== tickets.length - 1 ? 3 : 0, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'border.soft' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>TIC-{ticket.id}</Typography>
                                <StatusChip status={ticket.status} />
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>{ticket.title}</Typography>
                            {["assigned", "all"].includes(variant) &&(
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontSize: '11px' }}>
                                    Empleado: <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{ticket.createdById || "Cargando..."}</Box>
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
                                    Asignado a: <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{ticket.assignedToId || "Sin asignar"}</Box>
                                </Typography>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="caption" sx={{ color: latestDate.color, display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
                                    {latestDate.icon} {latestDate.label}: {latestDate.value}
                                </Typography>
                                <Link href="#" sx={{ fontWeight: 700, fontSize: "11px" }}> {["assigned", "all"].includes(variant) ? "GESTIONAR" : "VER"}</Link>
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            {/* Vista escritorio */}
            <TableContainer sx={{ display: { xs: 'none', sm: 'block' }, overflowX: 'auto' }}>
                <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'text.mid', fontWeight: 700 }}>ID</TableCell>
                            <TableCell sx={{ color: 'text.mid', fontWeight: 700 }}>TÍTULO</TableCell>
                            {["assigned", "all"].includes(variant) && (
                                <TableCell sx={{ color: 'text.mid', fontWeight: 700 }}>EMPLEADO</TableCell>
                            )}
                            <TableCell sx={{ color: 'text.mid', fontWeight: 700 }}>ETIQUETAS</TableCell>
                            <TableCell sx={{ color: 'text.mid', fontWeight: 700 }}>PRIORIDAD</TableCell>
                            <TableCell sx={{ color: 'text.mid', fontWeight: 700 }}>ESTADO</TableCell>
                            {variant === "all" && (
                                <TableCell sx={{ color: 'text.mid', fontWeight: 700 }}>ASIGNADO A</TableCell>
                            )}
                            <TableCell sx={{ color: 'text.mid', fontWeight: 700 }}>ÚLTIMA ACTIVIDAD</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {processedTickets.map((ticket) => {
                            const latestDate = getLatestDateInfo(ticket);
                            return (
                                <TableRow key={ticket.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>TIC-{ticket.id}</TableCell>
                                    <TableCell sx={{ fontWeight: 500, maxWidth: 250, color: 'text.primary' }}>{ticket.title}</TableCell>
                                    {["assigned", "all"].includes(variant) && (
                                        <TableCell sx={{ fontWeight: 500, color: 'text.primary' }}>
                                            {ticket.createdById || "Cargando..."}
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 180 }}>
                                            {ticket.labels?.map((label, i) => (
                                                <Chip key={i} label={label} size="small" variant="outlined" sx={{ fontSize: '10px', height: 20 }} />
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell><PriorityChip priority={ticket.priority} /></TableCell>
                                    <TableCell><StatusChip status={ticket.status} /></TableCell>
                                    {variant === "all" && (
                                        <TableCell sx={{ fontWeight: 500, color: 'text.primary' }}>
                                            {ticket.assignedToId || "Sin asignar"}
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: latestDate.color }}>
                                            {latestDate.icon}
                                            <Box>
                                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, lineHeight: 1, color: latestDate.color }}>
                                                    {latestDate.label}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 500, color: latestDate.color }}>
                                                    {latestDate.value}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Link href="#" sx={{ display: "flex", alignItems: "center", textDecoration: "none", fontWeight: 600, fontSize: "12px", color: "primary.main" }}>
                                             {["assigned", "all"].includes(variant) ? "Gestionar" : "Ver"}
                                            <ArrowIcon sx={{ fontSize: 16, ml: 0.5 }} />
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};
export default TicketTable;