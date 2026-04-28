import { Paper, Box, Typography } from "@mui/material";
import React, { useState, useMemo } from "react";
import DataTable from "../common/DataTable";
import TableToolbar from "../common/TableToolbar";
import EditLabelModal from "./EditLabelModal";
import LabelActionsCell from "./LabelActionsCell";

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
                <DataTable data={processedData} itemsPerPage={5} 
                columns={[
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
                                renderCell: (l) => (
                                    <LabelActionsCell
                                        label={l}
                                        isInactiveVariant={isInactiveVariant}
                                        onEdit={() => setEditingLabel(l)}
                                        onToggle={onToggle}
                                    />
                                )
                            }
                        ].filter(Boolean)}
                />
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

export default LabelTable;