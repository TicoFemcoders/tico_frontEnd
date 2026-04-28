import React, { useState } from "react";
import { Paper, Typography, Stack, Button, Box } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EnumChip from "../common/EnumChip";
import CloseTicketModal from "../modals/CloseTicketModal";
import ConfirmModal from "../modals/ConfirmModal";
import AlertModal from "../modals/AlertModal";
import { reopenTicket } from "../../services/ticketService";
import { TICKET_STATUS, STATUS_CONFIG, PRIORITY_CONFIG } from "../../utils/enums";
import { formatDate } from "../../utils/formatDate";
import { useSnackbar } from "notistack";

const InfoRow = ({ label, value }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>{label}</Typography>
        <Box sx={{ fontWeight: 600, fontSize: 13, textAlign: "right" }}>{value}</Box>
    </Box>
);

const StatusActionsPanel = ({ ticket, isAdmin, isAssignedToMe, isCreatorEmployee, onRefresh }) => {
    const [openCloseModal, setOpenCloseModal]         = useState(false);
    const [openReopenConfirm, setOpenReopenConfirm]   = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const isClosed = ticket?.status === TICKET_STATUS.CLOSED;

    const handleReopen = async () => {
        setOpenReopenConfirm(false);
        try {
            await reopenTicket(ticket.id);
            await onRefresh?.();
            enqueueSnackbar("Ticket reabierto con éxito", { variant: "success" });
        } catch (error) {
        enqueueSnackbar(error.friendlyMessage || "Error al reabrir el ticket", { variant: "error" });
        }
    };

    return (
        <>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "background.paper", border: "1px solid", borderColor: "border.soft" }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 1.5 }}>
                    ESTADO
                </Typography>
                <Stack spacing={1.5}>
                    <InfoRow label="Actual" value={<EnumChip value={ticket?.status} config={STATUS_CONFIG} type="status" />} />
                    <InfoRow label="Empleado" value={ticket?.createdByName || "Cargando..."} />
                    <InfoRow
                        label="Fecha creación"
                        value={
                            <Typography variant="body2" sx={{ fontWeight: 700, color: "error.main", fontSize: 13 }}>
                                {formatDate(ticket?.createdAt)}
                            </Typography>
                        }
                    />
                    {!isAdmin && (
                        <>
                            <InfoRow label="Prioridad" value={<EnumChip value={ticket?.priority} config={PRIORITY_CONFIG} type="priority" />}/>
                            <InfoRow label="Asignado a" value={ticket?.assignedToName || "Sin asignar"} />
                        </>
                    )}
                </Stack>
            </Paper>

            {!isAdmin && (
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: "primary.light", border: "1px solid", borderColor: "primary.main", textAlign: "center" }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: "primary.dark", display: "block", mb: 1, letterSpacing: 1, textTransform: "uppercase" }}>
                        Notificaciones Email
                    </Typography>
                    <Typography variant="body2" sx={{ color: "primary.dark", fontSize: 12, lineHeight: 1.5 }}>
                        Recibirás un email cada vez que el soporte actualice o cierre este ticket.
                    </Typography>
                </Paper>
            )}

            {isAdmin && (
                <Box>
                    {isClosed ? (
                        <Button
                            variant="contained" fullWidth color="success"
                            onClick={() => isAssignedToMe ? setOpenReopenConfirm(true) : 
                               enqueueSnackbar(`Solo el administrador asignado (${ticket?.assignedToName}) puede reabrir este ticket.`, 
                                { variant: "warning" })
                            }
                            sx={{ fontWeight: 700, borderRadius: 2 }}
                        >
                            Reabrir Ticket
                        </Button>
                    ) : (
                        <Button
                            variant="contained" fullWidth
                            onClick={() => isAssignedToMe 
                                    ? setOpenCloseModal(true) 
                                    : enqueueSnackbar(`Solo el administrador asignado (${ticket?.assignedToName}) puede cerrar este ticket.`, { variant: "warning" })
                            }
                            sx={{ bgcolor: "error.main", "&:hover": { bgcolor: "error.dark" } }}
                        >
                            Cerrar ticket
                        </Button>
                    )}
                </Box>
            )}

            {!isAdmin && isCreatorEmployee && isClosed && (
                <Button variant="outlined" fullWidth color="success" onClick={() => setOpenReopenConfirm(true)} sx={{ fontWeight: 700, borderRadius: 2 }}>
                    Reabrir mi ticket
                </Button>
            )}

            <CloseTicketModal open={openCloseModal} onClose={() => setOpenCloseModal(false)} ticket={ticket} onSuccess={onRefresh} />

            <ConfirmModal
                open={openReopenConfirm}
                onClose={() => setOpenReopenConfirm(false)}
                onConfirm={handleReopen}
                title="¿Reabrir ticket?"
                message="El ticket volverá a estar activo y se podrán enviar mensajes de nuevo."
                confirmLabel="Confirmar"
                confirmColor="success"
            />
        </>
    );
};

export default StatusActionsPanel;