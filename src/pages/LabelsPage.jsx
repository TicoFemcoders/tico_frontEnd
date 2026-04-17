import { Box, CircularProgress, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import { Lock as LockIcon } from "@mui/icons-material";
import PageHeader from "../components/common/PageHeader";
import LabelTable from "../components/labels/LabelTable";
import { labelService } from "../services/labelService";

const LabelsPage = () => {
    const [labels, setLabels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLabels = async () => {
            try {

                const data = await labelService.getAllLabels();

                console.log("Datos recibidos del servidor:", data);
                setLabels(data);
            } catch (error) {
                console.error("Error al cargar etiquetas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLabels();
    }, []);
    console.log("Etiquetas en estado:", labels);
    console.log("Filtro Activas:", labels.filter(l => l.active));
    const activeLabels = labels.filter(l => l.active === true);
    const inactiveLabels = labels.filter(l => l.active === false);

    return (
        <Box>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <PageHeader
                        title="Gestión de Etiquetas"
                        subtitle="Organiza los tickets con categorías y etiquetas personalizadas"
                        actionText="Nueva Etiqueta"
                        onActionClick={() => console.log("Crear etiqueta")}
                    />

                    <LabelTable
                        title="Etiquetas activas"
                        labels={activeLabels}
                        showFilter={true}
                    />

                    <Alert
                        severity="warning"
                        icon={<LockIcon fontSize="inherit" />}
                        sx={{ mb: 4, borderRadius: 2, bgcolor: '#fff4e5', color: '#663c00' }}
                    >
                        Las etiquetas con tickets activos no pueden ser desactivadas. Primero resuelve o reasigna los tickets asociados.
                    </Alert>

                    <LabelTable
                        title="Etiquetas inactivas"
                        labels={inactiveLabels}
                        showFilter={true}
                        isInactiveVariant
                    />
                </>
            )}
        </Box>
    );
};

export default LabelsPage;