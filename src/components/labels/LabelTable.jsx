import { Paper, Typography, Box, Link, TextField, IconButton, Tooltip } from "@mui/material";
import { Lock as LockIcon, Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";
import { useState, useMemo } from "react";
import DataTable from "../common/DataTable";
import TableToolbar from "../common/TableToolbar";

const LabelTable = ({
    title,
    labels,
    showFilter = false,
    isInactiveVariant = false,
    onToggle,
    onEdit
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [editingId, setEditingId]     = useState(null);
    const [draftName, setDraftName]     = useState("");

    const startEdit  = (label) => { setEditingId(label.id); setDraftName(label.name); };
    const cancelEdit = ()      => { setEditingId(null); setDraftName(""); };

    const confirmEdit = async (label) => {
        const trimmed = draftName.trim();
        if (trimmed && trimmed !== label.name) {
            await onEdit(label, trimmed);
        }
        cancelEdit();
    };

    const processedData = useMemo(() => {
        if (!searchQuery.trim()) return labels;
        return labels.filter(l =>
            l.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [labels, searchQuery]);

    const columns = [
        {
            header: "ETIQUETA",
            renderCell: (l) => {
                const isEditing = editingId === l.id;
                return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{
                            width: 12, height: 12,
                            borderRadius: "50%",
                            bgcolor: l.color,
                            flexShrink: 0
                        }} />
                        {isEditing ? (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <TextField
                                    value={draftName}
                                    onChange={(e) => setDraftName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter")  confirmEdit(l);
                                        if (e.key === "Escape") cancelEdit();
                                    }}
                                    size="small"
                                    autoFocus
                                    variant="outlined"
                                    sx={{ width: 180, "& .MuiInputBase-input": { fontSize: "13px", py: "4px" } }}
                                />
                                <Tooltip title="Confirmar">
                                    <IconButton size="small" color="success" onClick={() => confirmEdit(l)}>
                                        <CheckIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Cancelar">
                                    <IconButton size="small" color="error" onClick={cancelEdit}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        ) : (
                            <Typography sx={{ fontWeight: 600, fontSize: "13px" }}>
                                {l.name}
                            </Typography>
                        )}
                    </Box>
                );
            }
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
                const isEditing    = editingId === l.id;
                const canToggleOff = l.activeTickets === 0;

                if (isEditing) return null;

                return (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

                        {!isInactiveVariant && onEdit && (
                            <Box sx={{ width: 70, display: "flex", justifyContent: "center" }}>
                                <Link
                                    component="button"
                                    onClick={() => startEdit(l)}
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
        <Paper sx={{ borderRadius: 2, mb: 4, overflow: "hidden" }}>
            <TableToolbar
                title={title}
                showFilter={showFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Buscar etiqueta..."
                totalItems={labels.length}
            />
            <DataTable columns={columns} data={processedData} />
        </Paper>
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
