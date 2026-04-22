import { useState, useEffect, useCallback } from "react";
import { useSnackbar } from "notistack";
import { labelService } from "../services/labelService";

export const useLabels = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [labels, setLabels] = useState([]);
    const [loading, setLoading] = useState(true);

    const notify = useCallback((msg, variant = "success") => {
        enqueueSnackbar(msg, { variant });
    }, [enqueueSnackbar]);

    const handleError = useCallback((err, fallback = "Error inesperado") => {
        const msg = err.friendlyMessage || fallback;
        enqueueSnackbar(msg, { variant: "error" });
    }, [enqueueSnackbar]);

    const fetchLabels = useCallback(async () => {
        try {
            const data = await labelService.getAllLabels();
            setLabels(data);
        } catch (err) {
            handleError(err, "Error al cargar etiquetas");
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    useEffect(() => { fetchLabels(); }, [fetchLabels]);

    const createLabel = async ({ name, color }) => {
        await labelService.createLabel({ name, color, active: true });
        await fetchLabels();
        notify("Etiqueta creada correctamente");
    };

    const toggleLabel = async (label) => {
        if (label.active) {
            await labelService.deactivateLabel(label.id);
            notify("Etiqueta desactivada", "info");
        } else {
            await labelService.activateLabel(label.id);
            notify("Etiqueta activada");
        }
        await fetchLabels();
    };

  const editLabel = async (label, newName, newColor) => {
    await labelService.updateLabel(label.id, { name: newName, color: newColor });
    notify("Etiqueta actualizada");
    await fetchLabels();
};

    const activeLabels   = labels.filter(l => l.active === true);
    const inactiveLabels = labels.filter(l => l.active === false);

    return {
        loading,
        activeLabels,
        inactiveLabels,
        createLabel,
        toggleLabel,
        editLabel,
        handleError, 
    };
};