import { useState, useEffect, useCallback } from "react";
import { useSnackbar } from "notistack";
import { labelService } from "../services/labelService";
import { useProgressiveFetch } from "./useProgressiveFetch";

export const useLabels = () => {
    const { enqueueSnackbar } = useSnackbar();

    const notify = useCallback((msg, variant = "success") => {
        enqueueSnackbar(msg, { variant });
    }, [enqueueSnackbar]);

    const handleError = useCallback((err, fallback = "Error inesperado") => {
        const msg = err.friendlyMessage || fallback;
        enqueueSnackbar(msg, { variant: "error" });
    }, [enqueueSnackbar]);

    const fetchFn = useCallback((page, size) => labelService.getAllLabels(page, size), []);

    const { data: labels, loading, isSyncing, refetch: fetchLabels } = useProgressiveFetch(fetchFn);

    const createLabel = async ({ name, color }) => {
        await labelService.createLabel({ name, color, active: true });
        await fetchLabels();
        notify("Etiqueta creada correctamente");
    };

    const toggleLabel = async (label) => {
        try{
            if (label.active) {
                await labelService.deactivateLabel(label.id);
                notify("Etiqueta desactivada", "info");
            } else {
                await labelService.activateLabel(label.id);
                notify("Etiqueta activada");
            }
        } catch(err){
            notify(err.friendlyMessage || "No se pudo cambiar el estado de la etiqueta", "error");
        } finally{
            await fetchLabels();
        }
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
        isSyncing,
        activeLabels,
        inactiveLabels,
        createLabel,
        toggleLabel,
        editLabel,
        handleError, 
    };
};