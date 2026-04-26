import { Typography, Button, Box } from "@mui/material";
import AppModal from "../common/AppModal";

const AlertModal = ({
    open,
    onClose,
    title,
    message,
    icon,
    closeLabel = "Cerrar",
    children,
}) => (
    <AppModal
        open={open}
        onClose={onClose}
        title={title}
        maxWidth="xs"
        actions={
            <Button onClick={onClose} variant="outlined">
                {closeLabel}
            </Button>
        }
    >
        {icon && (
            <Box sx={{ textAlign: "center", mb: 2 }}>
                {icon}
            </Box>
        )}
        {message && (
            <Typography variant="body2" color="text.secondary">
                {message}
            </Typography>
        )}
        {children}
    </AppModal>
);

export default AlertModal;