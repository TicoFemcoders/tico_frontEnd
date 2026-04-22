import { Box, Button, Typography, Fade } from "@mui/material";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import AppModal from "../common/AppModal";
import LabelForm from "./LabelForm";
import { useCreateLabel } from "../../hooks/useCreateLabel";

const CreateLabelModal = ({ open, onClose, onCreate, onError }) => {
    const {
        name, setName,
        color, setColor,
        error, setError,
        isSuccess,
        reset,
        handleSubmit
    } = useCreateLabel({onCreate, onError });

    const handleClose = () => {
        onClose();
        setTimeout(reset, 200);
    };

    return (
        <AppModal
            open={open}
            onClose={handleClose}
            title="Nueva Etiqueta"
            maxWidth="xs"
            actions={!isSuccess && (
                <>
                    <Button onClick={handleClose} color="inherit">Cancelar</Button>
                    <Button onClick={() => handleSubmit(handleClose)} variant="contained" color="primary">
                        Guardar Etiqueta
                    </Button>
                </>
            )}
        >
            {isSuccess ? (
                <Fade in>
                    <Box sx={{ textAlign: "center", py: 3 }}>
                        <CheckCircleIcon sx={{ color: "success.main", fontSize: 50, mb: 1 }} />
                        <Typography variant="h3" color="success.main">
                            ¡Etiqueta creada con éxito!
                        </Typography>
                    </Box>
                </Fade>
            ) : (
                <LabelForm
                    name={name}
                    setName={(v) => { setName(v); setError(""); }}
                    color={color}
                    setColor={(v) => { setColor(v); setError(""); }}
                    error={error}
                />
            )}
        </AppModal>
    );
};

export default CreateLabelModal;