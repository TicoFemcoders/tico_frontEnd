import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function LabelInUseModal({ open, onClose, label, activeTickets, onEdit }) {

  if (!label) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>

      <DialogTitle sx={{ pb: 0.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: "text.primary" }}>
            No se puede desactivar
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1, textAlign: "center" }}>

        <Box sx={{ my: 2 }}>
          <LockOutlinedIcon sx={{ fontSize: 48, color: "warning.main" }} />
        </Box>

        <Typography sx={{ fontSize: 15, fontWeight: 700, color: "text.primary", mb: 1.5 }}>
          Etiqueta en uso
        </Typography>

        <Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.6 }}>
          La etiqueta{" "}
          <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mx: 0.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: label.color, display: "inline-block" }} />
            <Box component="strong" sx={{ color: "text.primary" }}>{label.name}</Box>
          </Box>
          {" "}está asignada a{" "}
          <Box component="strong" sx={{ color: "text.primary" }}>
            {activeTickets} tickets activos
          </Box>
          {" "}y no puede desactivarse. Edítala o espera a que los tickets se cierren.
        </Typography>

      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1, justifyContent: "center" }}>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={() => { onClose(); onEdit?.(label); }}
          sx={{ fontWeight: 600 }}
        >
          Editar etiqueta
        </Button>
      </DialogActions>

    </Dialog>
  );
}