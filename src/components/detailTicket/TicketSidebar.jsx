import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { StatusChip, PriorityChip } from "../common/TicketChips";
import { useEffect, useState } from "react";
import { labelService } from "../../services/labelService";
import { ticketService } from "../../services/ticketService";

const TicketSidebar = ({ ticket, isAdmin, onRefresh }) => {
  const [availableLabels, setAvailableLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // ✅ estado controlado de prioridad
  const [selectedPriority, setSelectedPriority] = useState(ticket?.priority || "MEDIUM");

  useEffect(() => {
    if (ticket?.priority) {
      setSelectedPriority(ticket.priority);
    }
  }, [ticket]);

  // ✅ cargar labels activos
  useEffect(() => {
    const loadLabels = async () => {
      try {
        const data = await labelService.getAllLabels();
        setAvailableLabels(data.filter((l) => l.active));
      } catch (error) {
        console.error("Error cargando etiquetas:", error);
      } finally {
        setLoading(false);
      }
    };
    loadLabels();
  }, []);

  // helper color label
  const getLabelColor = (name) => {
    const found = availableLabels.find((l) => l.name === name);
    return found?.color || "#ccc";
  };

  // ✅ handler único
  const handleUpdate = async (type, value) => {
    if (!value) return;

    setIsUpdating(true);
    try {
      switch (type) {
        case "label": {
          const selected = availableLabels.find((l) => l.name === value);
          if (!selected) return;
          await ticketService.assignLabel(ticket.id, selected.id);
          break;
        }
        case "priority":
          await ticketService.changePriority(ticket.id, value);
          break;
        case "close":
          await ticketService.closeTicket(ticket.id);
          break;
        default:
          break;
      }

      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(`Error actualizando ${type}:`, error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Stack spacing={2}>
      {isAdmin ? (
        <>
          <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 1.5 }}>
              ASIGNAR ADMINISTRADOR
              </Typography>             <TextField               select
               fullWidth
              size="small"
              //label="Seleccionar admin" 
              //value={assignedAdmin}
                //onChange={(e) => setAssignedAdmin(e.target.value)}
              sx={{ mb: 2 }}
            >
                <MenuItem value=""><em>Sin asignar</em></MenuItem>
              <MenuItem value="Carlos Martínez">Carlos Martínez</MenuItem>
               <MenuItem value="Ana García">Ana García</MenuItem>
             </TextField>
             <Button 
              variant="contained" 
               fullWidth 
             onClick={() => handleUpdateTicket({ assignedTo: assignedAdmin })} 
               disabled={isUpdating}
               sx={{ bgcolor: "#202B45", textTransform: "none", fontWeight: 700 }}
             >
               {isUpdating ? <CircularProgress size={24} color="inherit" /> : "Guardar"}
              </Button>
          </Paper>
          {/* PRIORIDAD */}
          <Paper sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: "text.secondary", mb: 1 }}
            >
              PRIORIDAD
            </Typography>

            <FormControl component="fieldset">
              <RadioGroup
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((p) => (
                  <FormControlLabel
                    key={p}
                    value={p}
                    control={<Radio size="small" />}
                    label={
                      <PriorityChip
                        priority={p}
                        sxOverrides={{ fontSize: 13, px: 1 }}
                      />
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleUpdate("priority", selectedPriority)}
              disabled={selectedPriority === ticket.priority || isUpdating}
              sx={{ mt: 1, fontWeight: 600, textTransform: "none" }}
            >
              {isUpdating ? <CircularProgress size={18} /> : "Cambiar"}
            </Button>
          </Paper>

          {/* ETIQUETAS */}
          <Paper sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: "text.secondary", mb: 1 }}
            >
              ETIQUETAS
            </Typography>

            {/* actuales */}
            <Box sx={{ mb: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {ticket.labels?.map((label, index) => (
                <Chip
                  key={index}
                  label={label}
                  size="small"
                  sx={{
                    bgcolor: getLabelColor(label),
                    color: "#fff",
                    fontWeight: 600,
                  }}
                />
              ))}
            </Box>

            {/* añadir */}
            <TextField
              select
              fullWidth
              size="small"
              value=""
              label="+ Añadir etiqueta"
              disabled={loading || isUpdating}
              onChange={(e) => handleUpdate("label", e.target.value)}
            >
              {availableLabels.map((label) => (
                <MenuItem key={label.id} value={label.name}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: label.color,
                      }}
                    />
                    {label.name}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Paper>

          {/* ESTADO */}
          <Paper sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: "text.secondary", mb: 2 }}
            >
              ESTADO
            </Typography>

            <Stack spacing={1.5}>
              <InfoRow label="Estado" value={<StatusChip status={ticket.status} />} />
              <InfoRow label="Prioridad" value={<PriorityChip priority={ticket.priority} />} />
              <InfoRow label="Creado" value={new Date(ticket.createdAt).toLocaleDateString()} />
            </Stack>
          </Paper>

          <Button
            variant="contained"
            fullWidth
            onClick={() => handleUpdate("close")}
            sx={{
              bgcolor: "#F44336",
              fontWeight: 700,
              "&:hover": { bgcolor: "#D32F2F" },
            }}
          >
            Cerrar Ticket
          </Button>
        </>
      ) : (
        /* EMPLEADO */
        <Paper sx={{ p: 3, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: "text.secondary", mb: 2 }}
          >
            INFORMACIÓN
          </Typography>

          <Stack spacing={2}>
            <InfoRow label="Estado" value={<StatusChip status={ticket.status} />} />
            <InfoRow label="Prioridad" value={<PriorityChip priority={ticket.priority} />} />
            <InfoRow label="Fecha" value={new Date(ticket.createdAt).toLocaleDateString()} />
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};

const InfoRow = ({ label, value }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Box>{value}</Box>
  </Box>
);

export default TicketSidebar;

