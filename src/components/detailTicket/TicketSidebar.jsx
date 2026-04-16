import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Chip,
} from "@mui/material";
import { StatusChip, PriorityChip } from "../common/TicketChips";
import { useState } from "react";

const TicketSidebar = ({ ticket, isAdmin }) => {
  const [assignedAdmin, setAssignedAdmin] = useState(ticket.assignedTo || "");

  // Función auxiliar para los circulitos de color en la prioridad
  const ColorDot = ({ color }) => (
    <Box
      component="span"
      sx={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        bgcolor: color,
        display: "inline-block",
        mr: 1,
      }}
    />
  );

  return (
    <Stack spacing={2}>
      {isAdmin && (
        <>
          {/* 1. ASIGNAR ADMINISTRADOR */}
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 1 }}>
              ASIGNAR ADMINISTRADOR
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={assignedAdmin}
              onChange={(e) => setAssignedAdmin(e.target.value)}
              SelectProps={{ native: true }}
              sx={{ mb: 2 }}
            >
              <option value="">Reasignar a...</option>
              <option value="Carlos Martínez">Carlos Martínez</option>
            </TextField>
            <Button variant="contained" sx={{ bgcolor: "#202B45", color: "white", textTransform: "none", fontWeight: 700 }} fullWidth>
              Guardar
            </Button>
          </Paper>

          {/* 2. PRIORIDAD CON PUNTOS DE COLOR */}
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 1 }}>
              PRIORIDAD
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup defaultValue={ticket.priority || "MEDIA"}>
                <FormControlLabel 
                  value="URGENTE" 
                  control={<Radio size="small" />} 
                  label={<Box sx={{ display: 'flex', alignItems: 'center' }}><ColorDot color="#B22222" /><Typography variant="body2">Urgente</Typography></Box>} 
                />
                <FormControlLabel 
                  value="ALTA" 
                  control={<Radio size="small" />} 
                  label={<Box sx={{ display: 'flex', alignItems: 'center' }}><ColorDot color="#E67E22" /><Typography variant="body2">Alta</Typography></Box>} 
                />
                <FormControlLabel 
                  value="MEDIA" 
                  control={<Radio size="small" />} 
                  label={<Box sx={{ display: 'flex', alignItems: 'center' }}><ColorDot color="#F1C40F" /><Typography variant="body2">Media</Typography></Box>} 
                />
                <FormControlLabel 
                  value="BAJA" 
                  control={<Radio size="small" />} 
                  label={<Box sx={{ display: 'flex', alignItems: 'center' }}><ColorDot color="#27AE60" /><Typography variant="body2">Baja</Typography></Box>} 
                />
              </RadioGroup>
            </FormControl>
            <Button variant="outlined" fullWidth sx={{ mt: 1, borderColor: "#divider", color: "text.primary", textTransform: "none" }}>
              Cambiar
            </Button>
          </Paper>

          {/* 3. ETIQUETAS (Nuevo bloque según mockup) */}
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 1 }}>
              ETIQUETAS
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Chip label="Etiqueta X" size="small" sx={{ bgcolor: "#E8EAF6", color: "#3F51B5", fontWeight: 600, borderRadius: 1 }} />
            </Box>
            <TextField
              fullWidth
              size="small"
              placeholder="+ Añadir etiqueta"
              InputProps={{ sx: { fontSize: '12px' } }}
            />
          </Paper>
        </>
      )}

      {/* 4. BLOQUE ESTADO / INFORMACIÓN */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 2 }}>
          ESTADO
        </Typography>
        <Stack spacing={2}>
          <InfoRow label="Actual" value={<StatusChip status={ticket.status} />} />
          <InfoRow label="Empleado" value={<Typography variant="body2" sx={{ fontWeight: 700 }}>{ticket.creatorName || "Ana García"}</Typography>} />
          <InfoRow label="Fecha creación" value={<Typography variant="body2" sx={{ color: "#D35400", fontWeight: 700 }}>{new Date(ticket.createdAt).toLocaleDateString()}</Typography>} />
        </Stack>
      </Paper>

      {/* BOTÓN FINAL ACCIÓN */}
      {isAdmin && (
        <Button 
          variant="contained" 
          fullWidth 
          sx={{ bgcolor: "#F44336", color: "white", fontWeight: 700, py: 1.5, borderRadius: 2, "&:hover": { bgcolor: "#D32F2F" } }}
        >
          Cerrar ticket
        </Button>
      )}
    </Stack>
  );
};

// Componente para filas de información
const InfoRow = ({ label, value }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
      {label}
    </Typography>
    <Box>{value}</Box>
  </Box>
);

export default TicketSidebar;

