import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  FormControlLabel,
  Radio,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControl,
} from "@mui/material";
import { labelService } from "../../services/labelService";
import { ticketService } from "../../services/ticketService";
import { userService } from "../../services/userService";
import PriorityChip from "../common/PriorityChip";
import StatusChip from "../common/StatusChip";
import LabelChip from "../common/LabelChip";
import CloseTicketModal from "../modals/CloseTicketModal";

const InfoRow = ({ label, value }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 1,
    }}
  >
    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
      {label}
    </Typography>
    <Box sx={{ fontWeight: 600, fontSize: 13, textAlign: "right" }}>
      {value}
    </Box>
  </Box>
);

const TicketSidebar = ({ ticket, isAdmin, onRefresh, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [openReopenConfirm, setOpenReopenConfirm] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openCloseModal, setOpenCloseModal] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [availableLabels, setAvailableLabels] = useState([]);
  const [admins, setAdmins] = useState([]);

  const [formData, setFormData] = useState({
    priority: "",
    assignedToId: "",
    labels: [],
  });

  const myAdminProfile = admins.find(
    (a) => Number(a.id) === Number(currentUserId),
  );
  const isAssignedToMe = ticket?.assignedToName === myAdminProfile?.name;
  const isClosed = ticket?.status === "CLOSED";
  const canEditAttributes = isAdmin && isAssignedToMe && !isClosed;

  useEffect(() => {
    if (ticket) {
      setFormData({
        priority: ticket.priority || "MEDIUM",
        assignedToId:
          admins.find((a) => a.name === ticket.assignedToName)?.id || "",
        labels: ticket.labels || [],
      });
    }
  }, [ticket, admins]);

  useEffect(() => {
    labelService
      .getAllLabels()
      .then((data) => setAvailableLabels(data.filter((l) => l.active)))
      .catch((err) => console.error("Error etiquetas:", err));

    userService
      .getAllAdmins()
      .then((data) => setAdmins(data))
      .catch((err) => console.error("Error admins:", err));
  }, []);

  const handleReassign = async () => {
    setIsUpdating(true);
    try {
      await ticketService.assignAdmin(ticket.id, Number(formData.assignedToId));
      if (onRefresh) await onRefresh();
      setOpenSuccessModal(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmUpdate = async () => {
    setOpenConfirm(false);
    setIsUpdating(true);
    try {
      const promises = [];
      if (formData.priority !== ticket.priority) {
        promises.push(
          ticketService.changePriority(ticket.id, formData.priority),
        );
      }

      const currentNames = ticket.labels.map((l) =>
        typeof l === "object" ? l.name : l,
      );
      const formNames = formData.labels.map((l) =>
        typeof l === "object" ? l.name : l,
      );

      formNames
        .filter((n) => !currentNames.includes(n))
        .forEach((n) => {
          const obj = availableLabels.find((al) => al.name === n);
          if (obj) promises.push(ticketService.assignLabel(ticket.id, obj.id));
        });

      currentNames
        .filter((n) => !formNames.includes(n))
        .forEach((n) => {
          const obj = availableLabels.find((al) => al.name === n);
          if (obj) promises.push(ticketService.removeLabel(ticket.id, obj.id));
        });

      await Promise.all(promises);
      setIsEditing(false);
      if (onRefresh) await onRefresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddLabelLocal = (name) => {
    if (!formData.labels.includes(name)) {
      setFormData((prev) => ({ ...prev, labels: [...prev.labels, name] }));
    }
  };

  const handleRemoveLabelLocal = (name) => {
    setFormData((prev) => ({
      ...prev,
      labels: prev.labels.filter((l) => l !== name),
    }));
  };

  return (
    <Stack spacing={2}>

      {isAdmin && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "var(--border)",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: "text.secondary",
              display: "block",
              mb: 1.5,
            }}
          >
            ASIGNAR ADMINISTRADOR
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={formData.assignedToId}
            onChange={(e) =>
              setFormData({ ...formData, assignedToId: e.target.value })
            }
            sx={{ mb: 1.5 }}
          >
            {admins.map((admin) => (
              <MenuItem key={admin.id} value={admin.id}>
                {admin.name}
              </MenuItem>
            ))}
          </TextField>
          <Button
            fullWidth
            variant="contained"
            size="small"
            onClick={handleReassign}
            disabled={isUpdating || !formData.assignedToId}
            sx={{
              bgcolor: "#223344",
              textTransform: "none",
              borderRadius: 1.5,
              "&:hover": { bgcolor: "#112233" },
            }}
          >
            Guardar
          </Button>
        </Paper>
      )}

      {isAdmin && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "var(--border)",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: "text.secondary",
              display: "block",
              mb: 1.5,
            }}
          >
            PRIORIDAD
          </Typography>
          <FormControl
            component="fieldset"
            disabled={!isEditing}
            sx={{ width: "100%", mb: 2 }}
          >
            <RadioGroup
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
            >
              {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((p) => (
                <FormControlLabel
                  key={p}
                  value={p}
                  control={<Radio size="small" />}
                  label={
                    <PriorityChip priority={p} sxOverrides={{ fontSize: 12 }} />
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>

          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: "text.secondary",
              mb: 1,
              display: "block",
            }}
          >
            ETIQUETAS
          </Typography>
          <Box sx={{ mb: 1.5, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {formData.labels.map((l, i) => (
              <LabelChip
                key={i}
                label={l}
                size="small"
                onDelete={
                  isEditing ? () => handleRemoveLabelLocal(l) : undefined
                }
              />
            ))}
          </Box>
          {isEditing && (
            <TextField
              select
              fullWidth
              size="small"
              label="+ Añadir etiqueta"
              value=""
              onChange={(e) => handleAddLabelLocal(e.target.value)}
            >
              {availableLabels.map((l) => (
                <MenuItem key={l.id} value={l.name}>
                  {l.name}
                </MenuItem>
              ))}
            </TextField>
          )}

          <Button
            fullWidth
            variant={isEditing ? "contained" : "outlined"}
            color={isEditing ? "success" : "primary"}
            size="small"
            onClick={
              isEditing
                ? () => setOpenConfirm(true)
                : () => {
                    if (canEditAttributes) setIsEditing(true);
                    else setOpenErrorModal(false);
                  }
            }
            sx={{ mt: 2, textTransform: "none", borderRadius: 1.5 }}
          >
            {isEditing
              ? "Guardar Cambios"
              : isClosed
                ? "Ticket Cerrado"
                : "Cambiar"}
          </Button>

          {isEditing && (
            <Button
              fullWidth
              size="small"
              sx={{ mt: 1, textTransform: "none" }}
              onClick={() => setIsEditing(false)}
            >
              Cancelar
            </Button>
          )}
        </Paper>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "var(--border)",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: "text.secondary",
            display: "block",
            mb: 1.5,
          }}
        >
          ESTADO
        </Typography>
        <Stack spacing={1.5}>
          <InfoRow
            label="Actual"
            value={<StatusChip status={ticket?.status} />}
          />
          <InfoRow
            label="Empleado"
            value={ticket?.createdByName || "Cargando..."}
          />
          <InfoRow
            label="Fecha creación"
            value={
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "error.main", fontSize: 13 }}
              >
                {ticket?.createdAt
                  ? new Date(ticket.createdAt).toLocaleDateString()
                  : "-"}
              </Typography>
            }
          />
          {!isAdmin && (
            <>
              <InfoRow
                label="Prioridad"
                value={<PriorityChip priority={ticket?.priority} />}
              />
              <InfoRow
                label="Asignado a"
                value={ticket?.assignedToName || "Sin asignar"}
              />
          
            </>
          )}
        </Stack>
      </Paper>

      {!isAdmin && (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: "primary.light",
            border: "1px solid",
            borderColor: "primary.main",
            textAlign: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: "primary.dark",
              display: "block",
              mb: 1,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Notificaciones Email
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "primary.dark", fontSize: 12, lineHeight: 1.5 }}
          >
            Recibirás un email cada vez que el soporte actualice o cierre este
            ticket.
          </Typography>
        </Paper>
      )}

      {isAdmin && (
        <Box>
          {ticket?.status === "CLOSED" ? (
            <Button
              variant="contained"
              fullWidth
              color="success"
              onClick={() => setOpenReopenConfirm(true)}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Reabrir Ticket
            </Button>
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={() => setOpenCloseModal(true)}
              sx={{
                bgcolor: "#f44336",
                fontWeight: 700,
                borderRadius: 2,
                "&:hover": { bgcolor: "#d32f2f" },
              }}
            >
              Cerrar ticket
            </Button>
          )}
        </Box>
      )}

      <CloseTicketModal
        open={openCloseModal}
        onClose={() => setOpenCloseModal(false)}
        ticket={ticket}
        onSuccess={() => onRefresh()}
      />

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>¿Guardar cambios?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Volver</Button>
          <Button onClick={confirmUpdate} variant="contained" color="success">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSuccessModal}
        onClose={() => setOpenSuccessModal(false)}
      >
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            ¡Actualizado!
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            El responsable ha sido actualizado.
          </Typography>
          <Button
            onClick={() => setOpenSuccessModal(false)}
            variant="contained"
            fullWidth
          >
            Aceptar
          </Button>
        </Box>
      </Dialog>

      <Dialog open={openErrorModal} onClose={() => setOpenErrorModal(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Acceso Restringido</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Solo el administrador asignado ({ticket?.assignedToName}) puede
            editar.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenErrorModal(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default TicketSidebar;
