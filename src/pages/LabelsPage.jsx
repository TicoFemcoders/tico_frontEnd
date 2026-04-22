import { useState } from "react";
import { Box, CircularProgress, Alert, Button } from "@mui/material";
import { Add as AddIcon, Lock as LockIcon } from "@mui/icons-material";
import PageHeader from "../components/common/PageHeader";
import LabelTable from "../components/labels/LabelTable";
import CreateLabelModal from "../components/labels/CreateLabelModal";
import { useLabels } from "../hooks/useLabels";

const LabelsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        loading,
        activeLabels,
        inactiveLabels,
        createLabel,
        toggleLabel,
        editLabel,
        handleError,
    } = useLabels();

    if (loading) return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Box sx={{ p: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                <PageHeader
                    title="Gestión de Etiquetas"
                    subtitle="Organiza los tickets con categorías y etiquetas personalizadas"
                />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Nueva Etiqueta
                </Button>
            </Box>

            <CreateLabelModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={createLabel}
                onError={handleError}
            />

            <LabelTable
                title="Etiquetas activas"
                labels={activeLabels}
                showFilter
                onToggle={toggleLabel}
                onEdit={editLabel}
            />

            <Alert
                severity="warning"
                icon={<LockIcon fontSize="inherit" />}
                sx={{ mb: 4, borderRadius: 2, bgcolor: "#fff4e5", color: "#663c00" }}
            >
                Las etiquetas con tickets activos no pueden ser desactivadas.
                Primero resuelve o reasigna los tickets asociados.
            </Alert>

            <LabelTable
                title="Etiquetas inactivas"
                labels={inactiveLabels}
                showFilter
                isInactiveVariant
                onToggle={toggleLabel}
            />
        </Box>
    );
};

export default LabelsPage;