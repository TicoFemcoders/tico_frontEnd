import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select, MenuItem, Box, Button, TextField, Alert, CircularProgress, OutlinedInput } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LabelChip from "../common/LabelChip";
import { useAuth } from "../../context/useAuth";
import * as ticketService from "../../services/ticketService";
import { labelService } from "../../services/labelService";
import { PRIORITY_CONFIG } from "../../utils/enums";
import { useSnackbar } from "notistack";

export default function CreateTicketForm() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({ title: "", description: "", priority: "", labelIds: [] });
  const [labels, setLabels] = useState([]);
  const [errors, setErrors] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    labelService.getAllLabels()
      .then(setLabels)
      .catch(() => setLabels([]));
  }, []);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.title || form.title.length < 5)
      e.title = "El asunto debe tener entre 5 y 100 caracteres.";
    if (!form.description || form.description.length < 10)
      e.description = "La descripción debe tener entre 10 y 500 caracteres.";
    if (!form.priority)
      e.priority = "Se requiere seleccionar prioridad.";
    if (!form.labelIds || form.labelIds.length === 0)
      e.labelIds = "Se requiere seleccionar al menos una etiqueta.";
    return e;
  };

  const handleDeleteLabel = (idToDelete) => {
    setForm(prev => ({
      ...prev,
      labelIds: prev.labelIds.filter(id => id !== idToDelete)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setErrors({});
    setLoading(true);
    try {
      await ticketService.createTicket(form);
      enqueueSnackbar("Ticket creado correctamente.", { variant: "success" });
      navigate("/my-tickets");
    } catch (err) {
      enqueueSnackbar(err.friendlyMessage || "Error al enviar el ticket. Inténtalo de nuevo.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const labelStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: "6px",
  };

  const labelText = {
    fontSize: "13px",
    fontWeight: 600,
    color: "text.primary",
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>

      <Box sx={{ mb: 3 }}>
        <Box sx={labelStyles}>
          <Box component="label" sx={labelText}>
            Título del problema <Box component="span" sx={{ color: "primary.main" }}>*</Box>
          </Box>
        </Box>
        <TextField
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Describe brevemente el problema..."
          fullWidth
          size="small"
          error={!!errors.title}
          helperText={errors.title}
          slotProps={{ htmlInput: { maxLength: 100 } }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={labelStyles}>
          <Box component="label" sx={labelText}>
            Descripción detallada <Box component="span" sx={{ color: "primary.main" }}>*</Box>
          </Box>
        </Box>
        <TextField
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Explica con detalle el problema..."
          fullWidth
          multiline
          rows={4}
          error={!!errors.description}
          helperText={errors.description}
          slotProps={{ htmlInput: { maxLength: 500 } }}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexDirection: { xs: "column", sm: "row" } }}>

        <Box sx={{ flex: 1 }}>
          <Box component="label" sx={{ ...labelText, display: "block", mb: "6px" }}>
            Etiqueta / Categoría <Box component="span" sx={{ color: "primary.main" }}>*</Box>
          </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {form.labelIds.map(id => (
            <LabelChip 
              key={id} 
              label={labels.find(l => l.id === id)} 
              onDelete={() => handleDeleteLabel(id)}
            />
          ))}
        </Box>

          <Select
            name="labelIds"
            multiple
            value={form.labelIds}
            onChange={handleChange}
            fullWidth
            size="small"
            displayEmpty
            renderValue={(selected) => (
              selected.length === 0 ? "Selecciona etiquetas..." : ""
            )}
            error={!!errors.labelIds}
          >
            <MenuItem value="" disabled>Selecciona una etiqueta...</MenuItem>
            {labels.map((label) => (
              <MenuItem key={label.id} value={label.id}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: label.color }} />
                  {label.name}
                </Box>
              </MenuItem>
            ))}
          </Select>

          {errors.labelIds && (
            <Box sx={{ fontSize: "11px", color: "error.main", mt: "4px" }}>
              {errors.labelIds}
            </Box>
          )}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Box component="label" sx={{ ...labelText, display: "block", mb: "6px" }}>
            Prioridad
          </Box>
          <Select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            fullWidth
            size="small"
            displayEmpty
            error={!!errors.priority}
          >
            <MenuItem value="" disabled>Selecciona prioridad...</MenuItem>
            {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
              <MenuItem key={key} value={key}>{config.icon}{config.label}</MenuItem>
            ))}
          </Select>
          {errors.priority && (
            <Box sx={{ fontSize: "11px", color: "error.main", mt: "4px" }}>
              {errors.priority}
            </Box>
          )}
        </Box>

      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          p: "12px 16px",
          mb: 3,
          bgcolor: "warning.light",
          borderLeft: "4px solid",
          borderColor: "warning.main",
          borderRadius: "0 6px 6px 0",
          fontSize: "13px",
          color: "text.primary",
        }}
      >
        <NotificationsNoneIcon sx={{ fontSize: 18, color: "warning.main" }} />
        <Box>
          <Box component="strong">Recibirás un email de confirmación</Box>{" "}
          cuando el técnico asigne o resuelva tu ticket
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/my-tickets")}
          disabled={loading}
          sx={{ fontSize: "13px", fontWeight: 600 }}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ fontSize: "13px", fontWeight: 600, px: 3 }}
        >
          {loading ? <CircularProgress size={18} color="inherit" /> : "Enviar ticket"}
        </Button>
      </Box>

    </Box>
  );
}