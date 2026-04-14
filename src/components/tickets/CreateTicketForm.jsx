import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useAuth } from "../../context/useAuth";
import * as ticketService from "../../services/ticketService";

const PRIORITIES = [
  { value: "LOW",      label: "Baja" },
  { value: "MEDIUM",   label: "Media" },
  { value: "HIGH",     label: "Alta" },
  { value: "CRITICAL", label: "Crítica" },
];

const now = new Date().toLocaleString("es-ES", {
  day: "2-digit", month: "2-digit", year: "numeric",
  hour: "2-digit", minute: "2-digit",
});

export default function CreateTicketForm() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm]       = useState({ title: "", description: "", priority: "" });
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState("");
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
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setErrors({});
    setLoading(true);
    try {
      await ticketService.createTicket(form, user.id);
      navigate("/dashboard-employee");
    } catch (err) {
      setApiError(err.response?.data?.mensaje || "Error al enviar el ticket. Inténtalo de nuevo.");
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

  const dateText = {
    fontSize: "11px",
    color: "text.secondary",
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>

      {apiError && (
        <Alert severity="error" sx={{ mb: 3, fontSize: "13px" }}>
          {apiError}
        </Alert>
      )}

      {/* Título */}
      <Box sx={{ mb: 3 }}>
        <Box sx={labelStyles}>
          <Box component="label" sx={labelText}>
            Título del problema <Box component="span" sx={{ color: "primary.main" }}>*</Box>
          </Box>
          <Box sx={dateText}>{now}</Box>
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

      {/* Descripción */}
      <Box sx={{ mb: 3 }}>
        <Box sx={labelStyles}>
          <Box component="label" sx={labelText}>
            Descripción detallada <Box component="span" sx={{ color: "primary.main" }}>*</Box>
          </Box>
          <Box sx={dateText}>{now}</Box>
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

      {/* Etiqueta y Prioridad */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexDirection: { xs: "column", sm: "row" } }}>

        {/* Etiqueta */}
        <Box sx={{ flex: 1 }}>
          <Box component="label" sx={{ ...labelText, display: "block", mb: "6px" }}>
            Etiqueta / Categoría <Box component="span" sx={{ color: "primary.main" }}>*</Box>
          </Box>
          <Select fullWidth size="small" displayEmpty defaultValue="">
            <MenuItem value="" disabled>Selecciona una etiqueta...</MenuItem>
          </Select>
        </Box>

        {/* Prioridad */}
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
            {PRIORITIES.map((p) => (
              <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
            ))}
          </Select>
          {errors.priority && (
            <Box sx={{ fontSize: "11px", color: "error.main", mt: "4px" }}>
              {errors.priority}
            </Box>
          )}
        </Box>

      </Box>

      {/* Aviso email */}
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

      {/* Botones */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/dashboard-employee")}
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