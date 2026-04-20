// import {
//   Box,
//   Paper,
//   Typography,
//   Stack,
//   TextField,
//   Button,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormControl,
//   Chip,
//   Divider,
//   MenuItem,
//   CircularProgress,
// } from "@mui/material";
// import { StatusChip, PriorityChip } from "../common/TicketChips";
// import { useEffect, useState } from "react";
// import { labelService } from "../../services/labelService";
// import { ticketService } from "../../services/ticketService";

// const TicketSidebar = ({ ticket, isAdmin }) => {
//   const [assignedAdmin, setAssignedAdmin] = useState(ticket.assignedTo || "");
//   const [availableLabels, setAvailableLabels] = useState([]);
//   const [loadingLabels, setLoadingLabels] = useState(true);
//   const [isUpdating, setIsUpdating] = useState(false);

//   useEffect(() => {
//     const fetchLabels = async () => {
//       try {
//         const data = await labelService.getAllLabels();
//         setAvailableLabels(data.filter(l => l.active));
//       } catch (error) {
//         console.error("Error cargando etiquetas en sidebar:", error);
//       } finally {
//         setLoadingLabels(false);
//       }
//     };
//     fetchLabels();
//   }, []);

//  const handleUpdateTicket = async (type, value) => {
//   setIsUpdating(true);
//   try {
//     if (type === "admin") {
//       // Usamos la función real: assignAdmin(ticketId, adminId)
//       // OJO: Tu backend pide adminId. Si mandas el nombre, asegúrate de que el select guarde el ID.
//       await ticketService.assignAdmin(ticket.id, value);
//       console.log("Admin asignado");
//     } 
//     else if (type === "label") {
//       // Usamos la función real: assignLabel(ticketId, labelId)
//       await ticketService.assignLabel(ticket.id, value);
//       console.log("Etiqueta asignada");
//     }
//     else if (type === "priority") {
//       await ticketService.changePriority(ticket.id, value);
//       console.log("Prioridad cambiada");
//     }
    
//     // Tip: Aquí deberías recargar los datos del ticket para ver los cambios
//     alert("Cambio guardado con éxito");
//   } catch (error) {
//     console.error(`Error al actualizar ${type}:`, error);
//     alert("No se pudo guardar el cambio.");
//   } finally {
//     setIsUpdating(false);
//   }
// };
//   // Función para los puntos de color en la vista Admin
//   const ColorDot = ({ color }) => (
//     <Box
//       component="span"
//       sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color, display: "inline-block", mr: 1 }}
//     />
//   );

//   return (
//     <Stack spacing={2}>
//       {isAdmin ? (
//         <>
//           {/* 1. ASIGNAR ADMINISTRADOR */}
//           <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
//             <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 1.5 }}>
//               ASIGNAR ADMINISTRADOR
//             </Typography>
//             <TextField
//               select
//               fullWidth
//               size="small"
//               label="Seleccionar admin" // Añadimos label para mejor UX
//               value={assignedAdmin}
//               onChange={(e) => setAssignedAdmin(e.target.value)}
//               sx={{ mb: 2 }}
//               // Quitamos SelectProps={{ native: true }} para usar el estilo real de MUI
//             >
//               <MenuItem value=""><em>Sin asignar</em></MenuItem>
//               <MenuItem value="Carlos Martínez">Carlos Martínez</MenuItem>
//               <MenuItem value="Ana García">Ana García</MenuItem>
//             </TextField>
//             {/* <Button 
//               variant="contained" 
//               fullWidth 
//               sx={{ bgcolor: "#202B45", textTransform: "none", fontWeight: 700 }}
//             >
//               Guardar
//             </Button> */}
//             <Button 
//               variant="contained" 
//               fullWidth 
//               onClick={() => handleUpdateTicket({ assignedTo: assignedAdmin })} // Guardado en BD
//               disabled={isUpdating}
//               sx={{ bgcolor: "#202B45", textTransform: "none", fontWeight: 700 }}
//             >
//               {isUpdating ? <CircularProgress size={24} color="inherit" /> : "Guardar"}
//             </Button>
//           </Paper>

//           {/* 2. PRIORIDAD */}
//           <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
//             <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 1 }}>
//               PRIORIDAD
//             </Typography>
//             <FormControl component="fieldset">
//               <RadioGroup defaultValue={ticket.priority || "MEDIUM"}>
//                 <FormControlLabel value="URGENTE" control={<Radio size="small" />} label={<Box sx={{ display: 'flex', alignItems: 'center' }}><ColorDot color="#B22222" /><Typography variant="body2">Urgente</Typography></Box>} />
//                 <FormControlLabel value="ALTA" control={<Radio size="small" />} label={<Box sx={{ display: 'flex', alignItems: 'center' }}><ColorDot color="#E67E22" /><Typography variant="body2">Alta</Typography></Box>} />
//                 <FormControlLabel value="MEDIA" control={<Radio size="small" />} label={<Box sx={{ display: 'flex', alignItems: 'center' }}><ColorDot color="#F1C40F" /><Typography variant="body2">Media</Typography></Box>} />
//                 <FormControlLabel value="BAJA" control={<Radio size="small" />} label={<Box sx={{ display: 'flex', alignItems: 'center' }}><ColorDot color="#27AE60" /><Typography variant="body2">Baja</Typography></Box>} />
//               </RadioGroup>
//             </FormControl>
//             <Button variant="outlined" fullWidth sx={{ mt: 1, textTransform: "none", color: 'text.primary', borderColor: 'divider' }}>
//               Cambiar
//             </Button>
//           </Paper>

//           {/* 3. ETIQUETAS (ADMIN) */}
//           {/* <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
//             <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 1 }}>
//               ETIQUETAS
//             </Typography>
//             <Box sx={{ mb: 1 }}>
//               <Chip label="Software" size="small" sx={{ bgcolor: "#EDEEF0", fontWeight: 600 }} />
//             </Box>
//             <TextField fullWidth size="small" placeholder="+ Añadir etiqueta" variant="standard" InputProps={{ disableUnderline: false, sx: { fontSize: '12px' } }} />
//           </Paper> */}
//           {/* 3. ETIQUETAS (ADMIN) */}
//           <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
//             <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 1 }}>
//               ETIQUETAS
//             </Typography>
            
//             {/* Chips de etiquetas ya asignadas al ticket */}
//             <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//               {ticket.tags?.map((tag, index) => (
//                 <Chip key={index} label={tag} size="small" sx={{ bgcolor: "#EDEEF0", fontWeight: 600 }} />
//               ))}
//             </Box>

//             {/* Desplegable para añadir nueva etiqueta */}
//             <TextField
//               select
//               fullWidth
//               size="small"
//               defaultValue=""
//               label="+ Añadir etiqueta"
//               onChange={(e) => {
//                   const newTag = e.target.value;
//                   console.log("Añadir etiqueta:", e.target.value);
//                   if (!ticket.tags?.includes(newTag)) {
//                   handleUpdateTicket({ tags: [...(ticket.tags || []), newTag] });
//                 }
//               }}
//             >
//               {availableLabels.map((label) => (
//                 <MenuItem key={label.id} value={label.name}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: label.color }} />
//                     {label.name}
//                   </Box>
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Paper>

//           {/* 4. ESTADO (ADMIN) */}
//           <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
//             <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 2 }}>
//               ESTADO
//             </Typography>
//             <Stack spacing={1.5}>
//               <InfoRow label="Actual" value={<StatusChip status={ticket.status} />} />
//               <InfoRow label="Empleado" value={<Typography variant="body2" fontWeight={600}>{ticket.creatorName || "Ana García"}</Typography>} />
//               <InfoRow label="Fecha creación" value={<Typography variant="body2" color="error.main" fontWeight={600}>{new Date(ticket.createdAt).toLocaleDateString()}</Typography>} />
//             </Stack>
//           </Paper>

//           <Button 
//             variant="contained" 
//             fullWidth 
//             sx={{ bgcolor: "#F44336", py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#D32F2F' } }}
//           >
//             Cerrar Ticket
//           </Button>
//         </>
//       ) : (
//         /* ================= VISTA EMPLEADO ================= */
//         <>
//           <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
//             <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 2 }}>
//               INFORMACIÓN
//             </Typography>
//             <Stack spacing={2.5}>
//               <InfoRow label="Estado" value={<StatusChip status={ticket.status} />} />
//               <InfoRow label="Prioridad" value={<PriorityChip priority={ticket.priority} />} />
//               <InfoRow label="Categoría" value={<Chip label={ticket.category || "General"} size="small" variant="outlined" />} />
//               <InfoRow label="Asignado a" value={<Typography variant="body2" fontWeight={600}>{ticket.assignedTo || "Pendiente"}</Typography>} />
//               <InfoRow label="Fecha creación" value={<Typography variant="body2" color="error.main" fontWeight={600}>{new Date(ticket.createdAt).toLocaleDateString()}</Typography>} />
//             </Stack>
//           </Paper>

//           {/* BANNER NOTIFICACIONES (Solo empleado) */}
//           <Paper 
//             sx={{ 
//               p: 3, 
//               borderRadius: 2, 
//               bgcolor: "#FDF2E9", // Color naranja muy clarito como el mockup
//               border: '1px solid', 
//               borderColor: "#FAD7BB",
//               textAlign: 'center'
//             }}
//           >
//             <Typography variant="subtitle2" sx={{ color: "#D35400", fontWeight: 700, mb: 1 }}>
//               NOTIFICACIONES EMAIL
//             </Typography>
//             <Typography variant="caption" sx={{ color: "#A04000", lineHeight: 1.4, display: 'block' }}>
//               Recibirás un email cada vez que el soporte actualice o cierre este ticket.
//             </Typography>
//           </Paper>
//         </>
//       )}
//     </Stack>
//   );
// };

// // Componente auxiliar para las filas de información
// const InfoRow = ({ label, value }) => (
//   <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//     <Typography variant="body2" sx={{ color: "text.secondary" }}>
//       {label}
//     </Typography>
//     <Box>{value}</Box>
//   </Box>
// );

// export default TicketSidebar;

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

  // --- CARGAR LABELS ---
  useEffect(() => {
    const loadLabels = async () => {
      try {
        const data = await labelService.getAllLabels();
        setAvailableLabels(data.filter((l) => l.active === true));
      } catch (error) {
        console.error("Error cargando etiquetas:", error);
      } finally {
        setLoading(false);
      }
    };
    loadLabels();
  }, []);

  // --- HELPERS ---
  const getLabelColor = (name) => {
    const found = availableLabels.find((l) => l.name === name);
    return found?.color || "#ccc";
  };

  // --- UPDATE HANDLER ---
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

  // --- COLOR DOT ---
  const ColorDot = ({ color }) => (
    <Box
      component="span"
      sx={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        bgcolor: color,
        display: "inline-block",
        mr: 1,
      }}
    />
  );

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
              label="Seleccionar admin" // Añadimos label para mejor UX
              value={assignedAdmin}
               onChange={(e) => setAssignedAdmin(e.target.value)}
              sx={{ mb: 2 }}
               // Quitamos SelectProps={{ native: true }} para usar el estilo real de MUI
            >
               <MenuItem value=""><em>Sin asignar</em></MenuItem>
             <MenuItem value="Carlos Martínez">Carlos Martínez</MenuItem>
              <MenuItem value="Ana García">Ana García</MenuItem>
            </TextField>
             {/* <Button 
               variant="contained" 
              fullWidth 
             sx={{ bgcolor: "#202B45", textTransform: "none", fontWeight: 700 }}
            >
              Guardar
            </Button> */}
            <Button 
             variant="contained" 
              fullWidth 
            onClick={() => handleUpdateTicket({ assignedTo: assignedAdmin })} // Guardado en BD
              disabled={isUpdating}
              sx={{ bgcolor: "#202B45", textTransform: "none", fontWeight: 700 }}
            >
              {isUpdating ? <CircularProgress size={24} color="inherit" /> : "Guardar"}
             </Button>
         </Paper>
          {/* PRIORIDAD */}
          <Paper sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", mb: 1 }}>
              PRIORIDAD
            </Typography>

            <FormControl component="fieldset">
              <RadioGroup
                value={ticket.priority}
                onChange={(e) => handleUpdate("priority", e.target.value)}
              >
                <FormControlLabel
                  value="CRITICAL"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ColorDot color="#B22222" />
                      Urgente
                    </Box>
                  }
                />
                <FormControlLabel
                  value="HIGH"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ColorDot color="#E67E22" />
                      Alta
                    </Box>
                  }
                />
                <FormControlLabel
                  value="MEDIUM"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ColorDot color="#F1C40F" />
                      Media
                    </Box>
                  }
                />
                <FormControlLabel
                  value="LOW"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ColorDot color="#27AE60" />
                      Baja
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Paper>

          {/* ETIQUETAS */}
          <Paper sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", mb: 1 }}>
              ETIQUETAS
            </Typography>

            {/* Chips actuales */}
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

            {/* Añadir etiqueta */}
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
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", mb: 2 }}>
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
        <>
          {/* VISTA EMPLEADO */}
          <Paper sx={{ p: 3, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", mb: 2 }}>
              INFORMACIÓN
            </Typography>

            <Stack spacing={2}>
              <InfoRow label="Estado" value={<StatusChip status={ticket.status} />} />
              <InfoRow label="Prioridad" value={<PriorityChip priority={ticket.priority} />} />
              <InfoRow label="Fecha" value={new Date(ticket.createdAt).toLocaleDateString()} />
            </Stack>
          </Paper>
        </>
      )}
    </Stack>
  );
};

const InfoRow = ({ label, value }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={600}>
      {value}
    </Typography>
  </Box>
);

export default TicketSidebar;