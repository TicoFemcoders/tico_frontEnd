import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AppModal from "../common/AppModal";

export default function LabelInUseModal({ open, onClose, label, activeTickets, onEdit }) {

  if (!label) return null;

  return (
    <AppModal
        open={open}
        onClose={onClose}
        title="No se puede desactivar"
        maxWidth="xs"
        actions={
            <>
                <Button variant="outlined" onClick={onClose}>Cancelar</Button>
                <Button variant="contained" onClick={() => { onClose(); onEdit?.(label); }} sx={{ fontWeight: 600 }}>
                    Editar etiqueta
                </Button>
            </>
        }
    >
        <Box sx={{ textAlign: "center", my: 2 }}>
            <LockOutlinedIcon sx={{ fontSize: 48, color: "warning.main" }} />
        </Box>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: "text.primary", mb: 1.5, textAlign: "center" }}>
            Etiqueta en uso
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.6, textAlign: "center" }}>
            La etiqueta{" "}
            <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mx: 0.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: label.color, display: "inline-block" }} />
                <Box component="strong" sx={{ color: "text.primary" }}>{label.name}</Box>
            </Box>
            {" "}está asignada a{" "}
            <Box component="strong" sx={{ color: "text.primary" }}>{activeTickets} tickets activos</Box>
            {" "}y no puede desactivarse. Edítala o espera a que los tickets se cierren.
        </Typography>
    </AppModal>
);
}