import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const DeleteUserModal = ({ open, onClose, user, onConfirm }) => {
    const hasOpenTickets = user?.openTickets > 0;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box>
                    <Typography variant="h6" fontWeight={700}>Eliminar usuario</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user?.name} · {user?.email}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                {hasOpenTickets && (
                    <Box sx={{ bgcolor: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 2, p: 2, mb: 3, display: "flex", gap: 1.5 }}>
                        <WarningAmberIcon sx={{ color: "#f28a2e", mt: 0.2 }} />
                        <Typography variant="body2" color="#92400e">
                            Este empleado tiene <strong>{user.openTickets} tickets abiertos</strong>. Debes reasignarlos a otro empleado antes de continuar.
                        </Typography>
                    </Box>
                )}

                {hasOpenTickets && (
                    <Box>
                        <Typography variant="body2" fontWeight={600} mb={1}>
                            Email del empleado que recibirá los tickets
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="empleado@cohispania.com"
                            size="small"
                        />
                    </Box>
                )}

                {!hasOpenTickets && (
                    <Typography variant="body2" color="text.secondary">
                        ¿Estás seguro? Esta acción no se puede deshacer.
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                <Button variant="outlined" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="contained" color="error" onClick={onConfirm}>
                    {hasOpenTickets ? "Reasignar y eliminar" : "Eliminar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteUserModal;