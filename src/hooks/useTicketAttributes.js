import { useState, useEffect } from "react";
import { labelService } from "../services/labelService";
import { ticketService } from "../services/ticketService";
import { useSnackbar } from "notistack";

export const useTicketAttributes = ({ ticket, onRefresh }) => {
    const [formData, setFormData] = useState({
        priority: "",
        labels: [],
    });
    const [availableLabels, setAvailableLabels] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const controller = new AbortController();
        labelService.getAllLabels()
            .then(data => {
                if (!controller.signal.aborted)
                    setAvailableLabels(data.filter(l => l.active));
            })
            .catch(() => {});
        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (ticket) {
            setFormData({
                priority: ticket.priority || "MEDIUM",
                labels: ticket.labels || [],
            });
        }
    }, [ticket]);

    const addLabel = (name) => {
        setFormData(prev => {
            const hasLabel = prev.labels.some(l => (typeof l === "object" ? l.name : l) === name);
            if (hasLabel) return prev;
            const fullLabel = availableLabels.find(l => l.name === name) || name;
            
            return { ...prev, labels: [...prev.labels, fullLabel] };
        });
    };

    const removeLabel = (name) => {
        setFormData(prev => ({
            ...prev,
            labels: prev.labels.filter(l => (typeof l === "object" ? l.name : l) !== name),
        }));
    };

    const confirmUpdate = async () => {
        setIsUpdating(true);
        try {
            const promises = [];

            if (formData.priority !== ticket.priority) {
                promises.push(ticketService.changePriority(ticket.id, formData.priority));
            }

            const currentNames = ticket.labels.map(l => typeof l === "object" ? l.name : l);
            const formNames = formData.labels.map(l => typeof l === "object" ? l.name : l);

            const labelsToAddIds = formNames
                .filter(n => !currentNames.includes(n))
                .map(n => availableLabels.find(al => al.name === n)?.id)
                .filter(Boolean);
            if (labelsToAddIds.length > 0) {
                promises.push(ticketService.assignLabels(ticket.id, labelsToAddIds));
            }

            currentNames
                .filter(n => !formNames.includes(n))
                .forEach(n => {
                    const obj = availableLabels.find(al => al.name === n);
                    if (obj) promises.push(ticketService.removeLabel(ticket.id, obj.id));
                });

            await Promise.all(promises);
            await onRefresh?.();
            enqueueSnackbar("Atributos actualizados con éxito", { variant: "success" });
        } catch (error) {
        enqueueSnackbar(error.friendlyMessage || "Error al actualizar el ticket", { variant: "error" });
        throw error;
        } finally {
            setIsUpdating(false);
        }
    };

    return { formData, setFormData, availableLabels, isUpdating, addLabel, removeLabel, confirmUpdate };
};