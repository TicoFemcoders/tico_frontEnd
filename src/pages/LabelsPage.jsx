import { Box, CircularProgress, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import { Lock as LockIcon } from "@mui/icons-material";
import PageHeader from "../components/common/PageHeader";
import LabelTable from "../components/labels/LabelTable";
import LabelForm from "../components/labels/LabelForm";
import { labelService } from "../services/labelService";

const LabelsPage = () => {
    const [labels, setLabels]   = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLabels = async () => {
        try {
            const data = await labelService.getAllLabels();
            console.log("Labels:", data);
            setLabels(data);
        } catch (error) {
            console.error("Error al cargar etiquetas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLabels(); }, []);

    const activeLabels   = labels.filter(l => l.active === true);
    const inactiveLabels = labels.filter(l => l.active === false);

    const handleCreateLabel = async (newLabelData) => {
        try {
            await labelService.createLabel(newLabelData);
            await fetchLabels();
        } catch (error) {
            console.error("Error al crear etiqueta:", error);
            alert("No se pudo crear la etiqueta");
        }
    };

    const handleToggleActive = async (label) => {
        try {
            if (label.active) {
               
                await labelService.deactivateLabel(label.id);
            } else {
              
                await labelService.activateLabel(label.id);
            }
            await fetchLabels();
        } catch (error) {
            console.error("Error al cambiar estado:", error);
            alert("Error al cambiar el estado de la etiqueta");
        }
    };

    const handleEditName = async (label, newName) => {
        try {
          
            await labelService.updateLabel(label.id, { name: newName, color: label.color });
            await fetchLabels();
        } catch (error) {
            console.error("Error al actualizar nombre:", error);
            alert("Error al actualizar el nombre de la etiqueta");
        }
    };

    return (
        <Box sx={{ p: 1 }}>
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <PageHeader
                        title="Gestión de Etiquetas"
                        subtitle="Organiza los tickets con categorías y etiquetas personalizadas"
                    />

                    <LabelTable
                        title="Etiquetas activas"
                        labels={activeLabels}
                        showFilter={true}
                        onToggle={handleToggleActive}
                        onEdit={handleEditName} 
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
                        showFilter={true}
                        isInactiveVariant           
                        onToggle={handleToggleActive}
                        
                    />
                    <LabelForm onAdd={handleCreateLabel} existingLabels={labels} />
                </>
            )}
        </Box>
    );
};

export default LabelsPage;
