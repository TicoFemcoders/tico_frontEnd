import { Paper, Box, Link, Typography, Tooltip } from "@mui/material";
import { Lock as LockIcon } from "@mui/icons-material";
import { useState, useMemo } from "react";
import DataTable from "../common/DataTable";
import TableToolbar from "../common/TableToolbar";
import EditLabelModal from "./EditLabelModal";

const LabelTable = ({
    title,
    labels,
    showFilter = false,
    isInactiveVariant = false,
    onToggle,
    onEdit,
    onError
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [editingLabel, setEditingLabel] = useState(null);

    const processedData = useMemo(() => {
        if (!searchQuery.trim()) return labels;
        return labels.filter(l =>
            l.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [labels, searchQuery]);

    const columns = [
        {
            header: "ETIQUETA",
            renderCell: (l) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{
                        width: 12, height: 12,
                        borderRadius: "50%",
                        bgcolor: l.color,
                        flexShrink: 0
                    }} />
                    <Typography sx={{ fontWeight: 600, fontSize: "13px" }}>
                        {l.name}
                    </Typography>
                </Box>
            )
        },

        !isInactiveVariant && {
            header: "TICKETS ACTIVOS",
            align: "center",
            renderCell: (l) => (
                <Typography sx={{ fontSize: "13px" }}>{l.activeTickets}</Typography>
            )
        },

        {
            header: "TICKETS CERRADOS",
            align: "center",
            renderCell: (l) => (
                <Typography sx={{ fontSize: "13px" }}>{l.closedTickets}</Typography>
            )
        },

        {
            header: "ACCIONES",
            align: "center",
            renderCell: (l) => {
                const canToggleOff = l.activeTickets === 0;

                return (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {!isInactiveVariant && onEdit && (
                            <Box sx={{ width: 70, display: "flex", justifyContent: "center" }}>
                                <Link
                                    component="button"
                                    onClick={() => setEditingLabel(l)}
                                    sx={actionLinkSx("primary.main")}
                                >
                                    EDITAR
                                </Link>
                            </Box>
                        )}

                        <Box sx={{ width: 110, display: "flex", justifyContent: "center" }}>
                            {isInactiveVariant ? (
                                <Link
                                    component="button"
                                    onClick={() => onToggle(l)}
                                    sx={actionLinkSx("success.main")}
                                >
                                    ACTIVAR
                                </Link>
                            ) : (
                                <Tooltip
                                    title={!canToggleOff
                                        ? "Tiene tickets activos. Resuélvelos antes de desactivar."
                                        : "Desactivar etiqueta"
                                    }
                                    disableHoverListener={canToggleOff}
                                >
                                    <span style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                        <Link
                                            component="button"
                                            disabled={!canToggleOff}
                                            onClick={() => canToggleOff && onToggle(l)}
                                            sx={{
                                                ...actionLinkSx(canToggleOff ? "error.main" : "text.disabled"),
                                                cursor: canToggleOff ? "pointer" : "not-allowed",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.5
                                            }}
                                        >
                                            {!canToggleOff && <LockIcon sx={{ fontSize: 14 }} />}
                                            DESACTIVAR
                                        </Link>
                                    </span>
                                </Tooltip>
                            )}
                        </Box>
                    </Box>
                );
            }
        }
    ].filter(Boolean);

    return (
        <>
            <Paper sx={{ borderRadius: 2, mb: 4, overflow: "hidden" }}>
                <TableToolbar
                    title={title}
                    showFilter={showFilter}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    searchPlaceholder="Buscar etiqueta..."
                    totalItems={labels.length}
                />
                <DataTable columns={columns} data={processedData} itemsPerPage={5} />
            </Paper>

            <EditLabelModal
                open={!!editingLabel}
                onClose={() => setEditingLabel(null)}
                label={editingLabel}
                onEdit={onEdit}
                onError={onError}
            />
        </>
    );
};

const actionLinkSx = (color) => ({
    textDecoration: "none",
    fontWeight: 700,
    color,
    fontSize: "12px",
    border: "none",
    bgcolor: "transparent",
    cursor: "pointer",
});

export default LabelTable;