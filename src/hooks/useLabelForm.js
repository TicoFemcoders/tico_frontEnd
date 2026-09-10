import { useState, useCallback } from "react";

export const useLabelForm = ({ mode = "create", onSuccess, onError }) => {
    const [name, setName] = useState("");
    const [color, setColor] = useState("#f28a2e");
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const reset = useCallback(() => {
        setName("");
        setColor("#f28a2e");
        setError("");
        setIsSuccess(false);
    }, []);

    const load = useCallback((label) => {
        setName(label.name);
        setColor(label.color);
        setError("");
    }, []);

    const handleSubmit = useCallback(async (onClose, labelRef) => {
        try {
            if (mode === "create") {
                await onSuccess({ name: name.trim(), color });
                setIsSuccess(true);
                setTimeout(onClose, 1500);
            } else {
                await onSuccess(labelRef, name.trim(), color);
                onClose();
            }
        } catch (err) {
            const msg = err.friendlyMessage || (mode === "create"
                ? "No se pudo crear la etiqueta"
                : "No se pudo actualizar la etiqueta");
            setError(msg);
            onError?.(err);
        }
    }, [mode, name, color, onSuccess, onError]);

    return { name, setName, color, setColor, error, setError, isSuccess, load, reset, handleSubmit };
};