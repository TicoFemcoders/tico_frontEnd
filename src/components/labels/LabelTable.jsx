import { Paper, Typography, Box, Chip, Link } from "@mui/material";
import { Lock as LockIcon } from "@mui/icons-material";
import { useState, useMemo } from "react";
import DataTable from "../common/DataTable";
import TableToolbar from "../common/TableToolbar";

const LabelTable = ({ title, labels, showFilter = false, isInactiveVariant = false }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const processedData = useMemo(() => {
        if (!searchQuery.trim()) return labels;
        return labels.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [labels, searchQuery]);

    const columns = [
        {
            header: "ETIQUETA",
            renderCell: (l) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: l.color }} />
                    <Typography sx={{ fontWeight: 600, fontSize: "13px" }}>{l.name}</Typography>
                </Box>
            )
        },
        {
            header: "COLOR",
            renderCell: (l) => (
                <Chip
                    label={l.color.toUpperCase()}
                    variant="outlined"
                    size="small"
                    sx={{ fontFamily: 'monospace', fontWeight: 700, borderRadius: 1 }}
                />
            )
        },

        !isInactiveVariant && {
            header: "TICKETS ACTIVOS",
            renderCell: (l) => <Typography sx={{ fontSize: "13px" }}>{l.activeTickets}</Typography>
        },
        {
            header: "TICKETS CERRADOS",
            renderCell: (l) => <Typography sx={{ fontSize: "13px" }}>{l.closedTickets}</Typography>
        },

        {
            header: "ACCIONES",
            align: "right",
            renderCell: (l) => (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Link href="#" sx={{ textDecoration: 'none', fontWeight: 700, color: 'primary.main', fontSize: '12px' }}>
                        EDITAR
                    </Link>


                    {!l.isActive ? (
                        <Link href="#" sx={{ textDecoration: 'none', fontWeight: 700, color: 'success.main', fontSize: '12px' }}>
                            ACTIVAR
                        </Link>
                    ) : (
                        <Link
                            href="#"
                            sx={{
                                textDecoration: 'none',
                                fontWeight: 700,
                                color: l.activeTicketsCount > 0 ? 'text.disabled' : 'error.main',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}
                        >
                            {l.activeTicketsCount > 0 && <LockIcon sx={{ fontSize: 14 }} />} DESACTIVAR
                        </Link>
                    )}
                </Box>
            )
        }
    ].filter(Boolean);

    return (
        <Paper sx={{ borderRadius: 2, mb: 4, overflow: "hidden" }}>
            <TableToolbar
                title={title}
                showFilter={showFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Buscar etiqueta..."
                totalItems={labels.length}
            />
            <DataTable
                columns={columns}
                data={processedData}
            />
        </Paper>
    );
};

export default LabelTable;