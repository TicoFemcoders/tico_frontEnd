import { Typography, Button } from "@mui/material";
import AppModal from "../common/AppModal";

const ConfirmModal = ({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    confirmColor = "primary",
    children,
}) => (
    <AppModal
        open={open}
        onClose={onClose}
        title={title}
        maxWidth="xs"
        actions={
            <>
                <Button onClick={onClose}>{cancelLabel}</Button>
                <Button onClick={onConfirm} variant="contained" color={confirmColor}>
                    {confirmLabel}
                </Button>
            </>
        }
    >
        {message && (
            <Typography variant="body2" color="text.secondary">
                {message}
            </Typography>
        )}
        {children}
    </AppModal>
);

export default ConfirmModal;