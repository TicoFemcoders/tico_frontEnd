import { useState } from "react";

export const useEditLabel = ({ onEdit, onError }) => {
    const [name, setName]   = useState("");
    const [color, setColor] = useState("#f28a2e");
    const [error, setError] = useState("");

    const load = (label) => {
        setName(label.name);
        setColor(label.color);
        setError("");
    };

    const reset = () => {
        setName("");
        setColor("#f28a2e");
        setError("");
    };

    const handleSubmit = async (label, onClose) => {
        try {
            await onEdit(label, name.trim(), color);
            onClose();
        } catch (err) {
            const msg = err.friendlyMessage || "No se pudo actualizar la etiqueta";
            setError(msg);
            onError(err);
        }
    };

    return { name, setName, color, setColor, error, setError, load, reset, handleSubmit };
};