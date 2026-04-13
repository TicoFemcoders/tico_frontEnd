import { Paper, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Select, MenuItem, Link, Stack } from "@mui/material";
import { ArrowForward as ArrowIcon, Update as UpdateIcon, CheckCircle as CheckIcon, AddCircle as AddIcon } from "@mui/icons-material";
import { StatusChip, PriorityChip } from "../common/TicketChips"; 


const getLatestDateInfo = (ticket) => {
    const dates = [
        { label: 'Creado', value: new Date(ticket.createdAt), color: 'dateStatus.created', icon: <AddIcon fontSize="inherit" /> },
        { label: 'Modificado', value: new Date(ticket.updatedAt), color: 'dateStatus.updated', icon: <UpdateIcon fontSize="inherit" /> },
    ];
    if (ticket.closedAt) {
        dates.push({ label: 'Cerrado', value: new Date(ticket.closedAt), color: 'dateStatus.closed', icon: <CheckIcon fontSize="inherit" /> });
    }
    const latest = dates.sort((a, b) => b.value - a.value)[0];
    return { ...latest, value: latest.value.toLocaleDateString() };
};

const TicketTable = ({ title, tickets, showFilter = false }) => {
    return(
    <Paper sx={{ borderRadius: 2, boxShadow: 1, mb: 4, overflow: "hidden", width: '100%', bgcolor: 'background.paper' }}>
        
        <Box sx={{ px: 3, py: 2, display: "flex", flexDirection: { xs: 'column', sm: 'row' }, justifyContent: "space-between", alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, borderBottom: "1px solid", borderColor: "border.soft" }}>
            <Typography variant="h2" sx={{ fontSize: '1.1rem' }}>{title}</Typography>
            {showFilter ? (
            <Select size="small" defaultValue="recent" sx={{ fontSize: "12px", minWidth: 150, width: { xs: '100%', sm: 'auto' } }}>
                <MenuItem value="recent">Más reciente primero</MenuItem>
            </Select>
            ) : (
            <Link href="#" variant="body2" sx={{ textDecoration: "none", fontWeight: 600 }}>Ver todos ({tickets.length})</Link>
            )}
        </Box>
        
        <Box sx={{ display: { xs: 'block', sm: 'none' }, p: 2 }}>
            {tickets.map((ticket, index) => {
            const latestDate = getLatestDateInfo(ticket);
            return (
                <Box key={ticket.id} sx={{ mb: index !== tickets.length - 1 ? 3 : 0, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'border.soft' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>TIC-{ticket.id}</Typography>
                    <StatusChip status={ticket.status} /> 
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>{ticket.title}</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2, gap: 0.5 }}>
                    {ticket.labels?.map((label, i) => (
                    <Chip key={i} label={label} size="small" variant="outlined" sx={{ fontSize: '9px', height: 18 }} />
                    ))}
                    <PriorityChip priority={ticket.priority} />
                </Stack>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: latestDate.color, display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
                    {latestDate.icon} {latestDate.label}: {latestDate.value}
                    </Typography>
                    <Link href="#" sx={{ fontWeight: 700, fontSize: "11px" }}>VER</Link>
                </Box>
                </Box>
            );
            })}
        </Box>
        
        <TableContainer sx={{ display: { xs: 'none', sm: 'block' }, overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: '#FAFAFA' }}>
                <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>TÍTULO</TableCell>
                <TableCell>ETIQUETAS</TableCell>
                <TableCell>PRIORIDAD</TableCell>
                <TableCell>ESTADO</TableCell>
                <TableCell>ÚLTIMA ACTIVIDAD</TableCell>
                <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {tickets.map((ticket) => {
                const latestDate = getLatestDateInfo(ticket);
                return (
                    <TableRow key={ticket.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 700 }}>TIC-{ticket.id}</TableCell>
                    <TableCell sx={{ color: 'text.mid', fontWeight: 500, maxWidth: 250 }}>{ticket.title}</TableCell>
                    <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 180 }}>
                            {ticket.labels?.map((label, i) => (
                                <Chip key={i} label={label} size="small" variant="outlined" sx={{ fontSize: '10px', height: 20 }} />
                            ))}
                        </Box>
                    </TableCell>
                    <TableCell><PriorityChip priority={ticket.priority} /></TableCell>
                    <TableCell><StatusChip status={ticket.status} /></TableCell>
                    <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: latestDate.color }}>
                            {latestDate.icon}
                            <Box>
                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, lineHeight: 1 }}>
                                    {latestDate.label}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: 'inherit' }}>
                                    {latestDate.value}
                                </Typography>
                            </Box>
                        </Stack>
                    </TableCell>
                    <TableCell align="right">
                        <Link href="#" sx={{ display: "flex", alignItems: "center", textDecoration: "none", fontWeight: 600, fontSize: "12px", color: "primary.main" }}>
                        Ver <ArrowIcon sx={{ fontSize: 16, ml: 0.5 }} />
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