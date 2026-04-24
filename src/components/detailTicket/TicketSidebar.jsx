import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Stack, TextField, Button, FormControlLabel, 
  Radio, MenuItem, RadioGroup, FormControl} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { labelService } from "../../services/labelService";
import { ticketService } from "../../services/ticketService";
import { userService } from "../../services/userService";
import { reopenTicket } from "../../services/ticketService";
import { useBlocker } from "react-router-dom";
import LabelChip from "../common/LabelChip";
import CloseTicketModal from "../modals/CloseTicketModal";
import ConfirmModal from "../modals/ConfirmModal";
import AlertModal from "../modals/AlertModal";
import { TICKET_STATUS, PRIORITY_CONFIG, STATUS_CONFIG } from "../../utils/enums";
import EnumChip from "../common/EnumChip";

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

const TicketSidebar = ({ ticket, isAdmin, onRefresh, currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [openReopenConfirm, setOpenReopenConfirm] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openCloseModal, setOpenCloseModal] = useState(false);
  const [openErrorReopenModal, setOpenErrorReopenModal] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [availableLabels, setAvailableLabels] = useState([]);
  const [admins, setAdmins] = useState([]);
  const blocker = useBlocker(isEditing);

  const [formData, setFormData] = useState({
    priority: "",
    assignedToId: "",
    labels: [],
  });

  const isAssignedToMe = ticket?.assignedToName === currentUser?.name;
  const isCreatorEmployee = ticket?.createdByName === currentUser?.name && !isAdmin;
  const isClosed = ticket?.status === TICKET_STATUS.CLOSED;
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

    if (isAdmin) {
    userService
      .getAllAdmins()
      .then((data) => setAdmins(data))
      .catch((err) => console.error("Error admins:", err));
  }
    }, [isAdmin]);

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
        promises.push(ticketService.changePriority(ticket.id, formData.priority));
      }

      const currentNames = ticket.labels.map((l) =>
        typeof l === "object" ? l.name : l
      );
      const formNames = formData.labels.map((l) =>
        typeof l === "object" ? l.name : l
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

  const handleReopen = async () => {
  setOpenReopenConfirm(false);
  try {
    await reopenTicket(ticket.id);
    if (onRefresh) await onRefresh();
  } catch (error) {
    console.error("Error al reabrir el ticket:", error);
  }
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
            sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 1.5 }}
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
            sx={{ bgcolor: "secondary.main", "&:hover": { bgcolor: "secondary.dark" } }}
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
            sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 1.5 }}
          >
            PRIORIDAD
          </Typography>
          <FormControl component="fieldset" disabled={!isEditing} sx={{ width: "100%", mb: 2 }}>
            <RadioGroup
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
            >
              {Object.keys(PRIORITY_CONFIG).map((p) => (
                <FormControlLabel
                  key={p}
                  value={p}
                  control={<Radio size="small" />}
                  label={<EnumChip value={p} config={PRIORITY_CONFIG} type="priority" sxOverrides={{ fontSize: 12 }} />}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: "text.secondary", mb: 1, display: "block" }}
          >
            ETIQUETAS
          </Typography>
          <Box sx={{ mb: 1.5, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {formData.labels.map((l, i) => (
              <LabelChip
                key={i}
                label={l}
                size="small"
                onDelete={isEditing ? () => handleRemoveLabelLocal(l) : undefined}
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
                    if (isClosed) return;
                    if (canEditAttributes) setIsEditing(true);
                    else setOpenErrorModal(true);
                  }
            }
            sx={{ mt: 2, textTransform: "none", borderRadius: 1.5 }}
          >
            {isEditing ? "Guardar Cambios" : isClosed ? "Ticket Cerrado" : "Cambiar"}
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
          sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 1.5 }}
        >
          ESTADO
        </Typography>
        <Stack spacing={1.5}>
          <InfoRow label="Actual" value={<EnumChip value={ticket?.status} config={STATUS_CONFIG} type="status" />} />
          <InfoRow label="Empleado" value={ticket?.createdByName || "Cargando..."} />
          <InfoRow
            label="Fecha creación"
            value={
              <Typography variant="body2" sx={{ fontWeight: 700, color: "error.main", fontSize: 13 }}>
                {ticket?.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "-"}
              </Typography>
            }
          />
          {!isAdmin && (
            <>
              <InfoRow label="Prioridad" value={<EnumChip value={ticket?.priority} config={PRIORITY_CONFIG} type="priority" />} />
              <InfoRow label="Asignado a" value={ticket?.assignedToName || "Sin asignar"} />
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
            sx={{ fontWeight: 800, color: "primary.dark", display: "block", mb: 1, letterSpacing: 1, textTransform: "uppercase" }}
          >
            Notificaciones Email
          </Typography>
          <Typography variant="body2" sx={{ color: "primary.dark", fontSize: 12, lineHeight: 1.5 }}>
            Recibirás un email cada vez que el soporte actualice o cierre este ticket.
          </Typography>
        </Paper>
      )}

        {isAdmin && (
            <Box>
              {ticket?.status === TICKET_STATUS.CLOSED ? (
                <Button
                  variant="contained"
                  fullWidth
                  color="success"
                  onClick={() => isAssignedToMe ? setOpenReopenConfirm(true) : setOpenErrorReopenModal(true)}
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                >
                  Reabrir Ticket
                </Button>
              ) : (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setOpenCloseModal(true)}
                  sx={{ bgcolor: "error.main", "&:hover": { bgcolor: "error.dark" } }}
                >
                  Cerrar ticket
                </Button>
              )}
            </Box>
          )}

      {!isAdmin && isCreatorEmployee && ticket?.status === TICKET_STATUS.CLOSED && (
        <Button
          variant="outlined"
          fullWidth
          color="success"
          onClick={() => setOpenReopenConfirm(true)}
          sx={{ fontWeight: 700, borderRadius: 2 }}
        >
          Reabrir mi ticket
        </Button>
      )}

      <CloseTicketModal
        open={openCloseModal}
        onClose={() => setOpenCloseModal(false)}
        ticket={ticket}
        onSuccess={() => onRefresh()}
      />

      <ConfirmModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={confirmUpdate}
        title="¿Guardar cambios?"
        confirmLabel="Confirmar"
        confirmColor="success"
      />

      <AlertModal
          open={openSuccessModal}
          onClose={() => setOpenSuccessModal(false)}
          title="¡Actualizado!"
          closeLabel="Aceptar"
          icon={<CheckCircleOutlineIcon sx={{ fontSize: 48, color: "success.main" }} />}
          message="El responsable ha sido actualizado correctamente."
      />

      <AlertModal
          open={openErrorModal}
          onClose={() => setOpenErrorModal(false)}
          title="Acceso Restringido"
      >
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <WarningAmberIcon sx={{ color: "warning.main", mt: 0.3 }} />
              <Typography variant="body2">
                  Solo el administrador asignado{" "}
                  <strong>({ticket?.assignedToName})</strong> puede editar la
                  prioridad y las etiquetas de este ticket.
              </Typography>
          </Box>
      </AlertModal>

      <AlertModal
          open={openErrorReopenModal}
          onClose={() => setOpenErrorReopenModal(false)}
          title="Acceso Restringido"
      >
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <WarningAmberIcon sx={{ color: "warning.main", mt: 0.3 }} />
              <Typography variant="body2">
                  Solo el administrador asignado{" "}
                  <strong>({ticket?.assignedToName})</strong> puede reabrir este ticket.
              </Typography>
          </Box>
      </AlertModal>

      <ConfirmModal
          open={openReopenConfirm}
          onClose={() => setOpenReopenConfirm(false)}
          onConfirm={handleReopen}
          title="¿Reabrir ticket?"
          message="El ticket volverá a estar activo y se podrán enviar mensajes de nuevo."
          confirmLabel="Confirmar"
          confirmColor="success"
      />
      <ConfirmModal
          open={blocker.state === "blocked"}
          onClose={() => blocker.reset?.()}
          onConfirm={() => blocker.proceed?.()}
          title="¿Salir sin guardar?"
          confirmLabel="Salir sin guardar"
          confirmColor="error"
          cancelLabel="Volver"
      >
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <WarningAmberIcon sx={{ color: "warning.main", mt: 0.3 }} />
              <Typography variant="body2">
                  Tienes cambios sin guardar en prioridad o etiquetas. Si sales ahora se perderán.
              </Typography>
          </Box>
      </ConfirmModal>
          </Stack>
  );
};

export default TicketSidebar;
