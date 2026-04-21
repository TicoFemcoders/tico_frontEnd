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
  Chip,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControl,
} from "@mui/material";
import { StatusChip, PriorityChip } from "../common/TicketChips";
import { labelService } from "../../services/labelService";
import { ticketService } from "../../services/ticketService";

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
    <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
      {value}
    </Typography>
  </Box>
);

const TicketSidebar = ({ ticket, isAdmin, onRefresh, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [availableLabels, setAvailableLabels] = useState([]);

  const isAssignedToMe = ticket?.assignedTo?.id === currentUserId;
  const canEditAttributes = isAdmin && isAssignedToMe;

  const [formData, setFormData] = useState({
    priority: ticket?.priority || "MEDIUM",
    assignedToId: ticket?.assignedTo?.id || "",
    labels: ticket?.labels || [],
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        priority: ticket.priority || "MEDIUM",
        assignedToId: ticket.assignedTo?.id || "",
        labels: ticket.labels || [],
      });
    }
  }, [ticket]);

  useEffect(() => {
    labelService
      .getAllLabels()
      .then((data) => setAvailableLabels(data.filter((l) => l.active)))
      .catch((err) => console.error("Error labels:", err));
  }, []);

  const handleEditClick = () => {
    if (canEditAttributes) setIsEditing(true);
    else setOpenErrorModal(true);
  };

  const handleAddLabelLocal = (labelName) => {
    if (!formData.labels.includes(labelName)) {
      setFormData((prev) => ({ ...prev, labels: [...prev.labels, labelName] }));
    }
  };

  const handleRemoveLabelLocal = (labelName) => {
    setFormData((prev) => ({
      ...prev,
      labels: prev.labels.filter((l) => l !== labelName),
    }));
  };

  const getLabelColor = (name) => {
    const found = availableLabels.find((l) => l.name === name);
    return found?.color || "#ccc";
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
      if (formData.assignedToId != (ticket.assignedTo?.id || "")) {
        promises.push(
          ticketService.assignAdmin(ticket.id, Number(formData.assignedToId)),
        );
      }

      const toAdd = formData.labels.filter((l) => !ticket.labels.includes(l));
      const toRemove = ticket.labels.filter(
        (l) => !formData.labels.includes(l),
      );

      toAdd.forEach((name) => {
        const id = availableLabels.find((al) => al.name === name)?.id;
        if (id) promises.push(ticketService.assignLabel(ticket.id, id));
      });

      toRemove.forEach((name) => {
        const id = availableLabels.find((al) => al.name === name)?.id;
        if (id) promises.push(ticketService.removeLabel(ticket.id, id));
      });

      await Promise.all(promises);
      setIsEditing(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error detallado:", error.response?.data || error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isAdmin) {
    return (
      <Stack spacing={3}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: "background.paper",
            boxShadow: "var(--shadow)",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: "text.secondary",
              mb: 2,
              display: "block",
              textTransform: "uppercase",
            }}
          >
            Información
          </Typography>
          <Stack spacing={1.5}>
            <InfoRow
              label="Estado"
              value={<StatusChip status={ticket?.status} />}
            />
            <InfoRow
              label="Prioridad"
              value={<PriorityChip priority={ticket?.priority} />}
            />
            <InfoRow
              label="Categoría"
              value={
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{
                    justifyContent: "flex-end",
                    flexWrap: "wrap",
                  }}
                >
                  {ticket?.labels?.map((l, i) => (
                    <Chip
                      key={i}
                      label={l}
                      size="small"
                      sx={{ height: 24, fontSize: 11, fontWeight: 600 }}
                    />
                  ))}
                </Stack>
              }
            />
            <InfoRow
              label="Asignado a"
              value={ticket?.assignedTo?.name || "Sin asignar"}
            />
            <InfoRow
              label="Fecha creación"
              value={
                ticket?.createdAt
                  ? new Date(ticket.createdAt).toLocaleDateString()
                  : "-"
              }
            />
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: "#fff7ed",
            border: "1px solid #fdba74",
            textAlign: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: "#ea580c",
              display: "block",
              mb: 1,
              letterSpacing: 1.2,
              textTransform: "uppercase",
            }}
          >
            Notificaciones Email
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#9a3412", fontSize: 12, lineHeight: 1.5 }}
          >
            Recibirás un email cada vez que el soporte actualice o cierre este
            ticket.
          </Typography>
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: "background.paper",
          boxShadow: "var(--shadow)",
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
          REASIGNAR TICKET
        </Typography>
        <TextField
          select
          fullWidth
          size="small"
          value={formData.assignedToId}
          onChange={(e) =>
            setFormData({ ...formData, assignedToId: e.target.value })
          }
          sx={{ mb: 2 }}
        >
          {/* AQUI IRA LA LISTA DE ADMINS */}
          <MenuItem value="">
            <em>Sin asignar</em>
          </MenuItem>
          <MenuItem value={4}>Admin2 (Tú)</MenuItem>
          <MenuItem value={1}>Carlos Martínez</MenuItem>
          <MenuItem value={2}>Ana García</MenuItem>
        </TextField>
        <Button
          fullWidth
          variant="contained"
          size="small"
          onClick={confirmUpdate}
          disabled={
            isUpdating ||
            formData.assignedToId == (ticket?.assignedTo?.id || "")
          }
          sx={{
            bgcolor: "secondary.main",
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Actualizar Asignación
        </Button>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: "background.paper",
          boxShadow: "var(--shadow)",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: "text.secondary",
            mb: 2,
            display: "block",
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
            mb: 2,
            display: "block",
          }}
        >
          ETIQUETAS
        </Typography>
        <Box sx={{ mb: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {formData.labels.map((label, index) => (
            <Chip
              key={index}
              label={label}
              size="small"
              onDelete={
                isEditing ? () => handleRemoveLabelLocal(label) : undefined
              }
              sx={{
                bgcolor: getLabelColor(label),
                color: "#fff",
                fontWeight: 600,
                borderRadius: 1.5,
              }}
            />
          ))}
        </Box>

        {isEditing && (
          <TextField
            select
            fullWidth
            size="small"
            label="+ Etiqueta"
            value=""
            onChange={(e) => handleAddLabelLocal(e.target.value)}
            sx={{ mt: 1 }}
          >
            {availableLabels.map((l) => (
              <MenuItem key={l.id} value={l.name}>
                {l.name}
              </MenuItem>
            ))}
          </TextField>
        )}

        <Box sx={{ mt: 2 }}>
          {!isEditing ? (
            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={handleEditClick}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Editar
            </Button>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                size="small"
                onClick={() => setOpenConfirm(true)}
              >
                Guardar
              </Button>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </Button>
            </Stack>
          )}
        </Box>
      </Paper>

      {ticket?.status !== "CLOSED" && (
        <Button
          variant="contained"
          fullWidth
          onClick={() =>
            ticketService.closeTicket(ticket.id).then(() => onRefresh())
          }
          sx={{
            bgcolor: "error.main",
            "&:hover": { bgcolor: "#dc2626" },
            color: "white",
            fontWeight: 700,
            borderRadius: 2,
            textTransform: "none",
          }}
        >
          Cerrar Ticket
        </Button>
      )}

      <Dialog
        open={openErrorModal}
        onClose={() => setOpenErrorModal(false)}
        disableRestoreFocus
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Acceso Denegado</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Solo el administrador asignado puede editar este ticket.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenErrorModal(false)}>Entendido</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        disableRestoreFocus
      >
        <DialogTitle sx={{ fontWeight: 700 }}>¿Confirmar cambios?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancelar</Button>
          <Button onClick={confirmUpdate} variant="contained" color="success">
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default TicketSidebar;
