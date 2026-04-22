import { useState } from "react";

export const useCreateLabel = ({ onCreate, onError }) => {
    const [name, setName]           = useState("");
    const [color, setColor]         = useState("#f28a2e");
    const [error, setError]         = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const reset = () => {
        setName("");
        setColor("#f28a2e");
        setError("");
        setIsSuccess(false);
    };

    const handleSubmit = async (onClose) => {
        try {
            await onCreate({ name: name.trim(), color });
            setIsSuccess(true);
            setTimeout(onClose, 1500);
        } catch (err) {
            const msg = err.friendlyMessage || "No se pudo crear la etiqueta";
            setError(msg);
            onError(err);
        }
    };

    return { name, setName, color, setColor, error, setError, isSuccess, reset, handleSubmit };
};