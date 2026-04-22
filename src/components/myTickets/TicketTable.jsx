<<<<<<< HEAD
import { Paper, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Select, MenuItem, Link, Stack, TextField, InputAdornment } from "@mui/material";
import { ArrowForward as ArrowIcon, Update as UpdateIcon, CheckCircle as CheckIcon, AddCircle as AddIcon,  Search as SearchIcon } from "@mui/icons-material";
import { StatusChip, PriorityChip } from "../common/TicketChips";
import React, { useState, useMemo } from "react";
=======
import { Paper, Box, Typography, Link } from "@mui/material";
import { ArrowForward as ArrowIcon} from "@mui/icons-material";
import { useState, useMemo } from "react";
>>>>>>> c1485843a70afaa9b4c8dc17bb378ec6442b8907
import DataTable from "../common/DataTable";
import TableToolbar from "../common/TableToolbar";
import { useLocation, Link as RouterLink } from "react-router-dom";
import StatusChip from "../common/StatusChip";
import PriorityChip from "../common/PriorityChip";
import TicketLabels from "./TicketLabels";
import LatestDateInfo from "./LatestDateInfo";
import TicketCardMobile from "./TicketCardMobile";

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
            renderCell: (t) => <Typography sx={{ fontWeight: 500, color: 'text.primary', fontSize: "13px" }}>{t.createdByName || "Desconocido"}</Typography>
        },
        { header: "ETIQUETAS", renderCell: (t) => <TicketLabels labels={t.labels} /> },
        { header: "PRIORIDAD", renderCell: (t) => <PriorityChip priority={t.priority} /> },
        { header: "ESTADO", renderCell: (t) => <StatusChip status={t.status} /> },
        variant === "all" && {
            header: " ASIGNADO A",
            renderCell: (t) => <Typography sx={{ fontWeight: 500, color: 'text.primary', fontSize: "13px" }}>{t.assignedToName || "Sin asignar"}</Typography>
        },
       { header: "ÚLTIMA ACTIVIDAD", renderCell: (t) => <LatestDateInfo ticket={t} /> },
        {
            align: "right",
            renderCell: (t) => (
                <Link component={RouterLink} to={`/detail-ticket/${t.id}`} state={{ fromPath: location.pathname }} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", textDecoration: "none", fontWeight: 600, fontSize: "12px", color: "primary.main" }}>
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
                itemsPerPage={5}
                mobileRenderer={(ticket) => (
                    <TicketCardMobile 
                        key={ticket.id} 
                        ticket={ticket} 
                        variant={variant} 
                        fromPath={location.pathname} 
                    />
                )}
            />
        </Paper>
    );
 }
export default TicketTable;

