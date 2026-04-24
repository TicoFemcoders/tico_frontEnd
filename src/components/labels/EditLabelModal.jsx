import { Button } from "@mui/material";
import AppModal from "../common/AppModal";
import LabelForm from "./LabelForm";
import { useEditLabel } from "../../hooks/useEditLabel";
import { useEffect } from "react";

const EditLabelModal = ({ open, onClose, label, onEdit, onError }) => {
    const {
        name, setName,
        color, setColor,
        error, setError,
        load, reset,
        handleSubmit
    } = useEditLabel({ onEdit, onError });

  
    useEffect(() => {
        if (open && label) load(label);
    }, [open, label]);

    const handleClose = () => {
        onClose();
        setTimeout(reset, 200);
    };

    return (
        <AppModal
            open={open}
            onClose={handleClose}
            title="Editar Etiqueta"
            maxWidth="xs"
            actions={
                <>
                    <Button onClick={handleClose} color="inherit">Cancelar</Button>
                    <Button onClick={() => handleSubmit(label, handleClose)} variant="contained" color="primary">
                        Guardar Cambios
                    </Button>
                </>
            }
        >
            <LabelForm
                name={name}
                setName={(v) => { setName(v); setError(""); }}
                color={color}
                setColor={(v) => { setColor(v); setError(""); }}
                error={error}
            />
        </AppModal>
    );
};

export default EditLabelModal;