// import {
//   Box,
//   Paper,
//   Typography,
//   Stack,
//   TextField,
//   Button,
//   FormControl,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Chip,
//   MenuItem,
//   CircularProgress,
// } from "@mui/material";
// import { StatusChip, PriorityChip } from "../common/TicketChips";
// import { useEffect, useState } from "react";
// import { labelService } from "../../services/labelService";
// import { ticketService } from "../../services/ticketService";

// const TicketSidebar = ({ ticket, isAdmin, onRefresh }) => {
//   const [availableLabels, setAvailableLabels] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [assignedAdmin, setAssignedAdmin] = useState(ticket?.assignedTo?.id || "");

//   // ✅ estado controlado de prioridad
//   const [selectedPriority, setSelectedPriority] = useState(ticket?.priority || "MEDIUM");

//   useEffect(() => {
//     if (ticket?.priority) {
//       setSelectedPriority(ticket.priority);
//     }
//   }, [ticket]);

//   // ✅ cargar labels activos
//   useEffect(() => {
//     const loadLabels = async () => {
//       try {
//         const data = await labelService.getAllLabels();
//         setAvailableLabels(data.filter((l) => l.active));
//       } catch (error) {
//         console.error("Error cargando etiquetas:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadLabels();
//   }, []);

//   // helper color label
//   const getLabelColor = (name) => {
//     const found = availableLabels.find((l) => l.name === name);
//     return found?.color || "#ccc";
//   };

//   // ✅ handler único
//   const handleUpdate = async (type, value) => {
//     if (!value) return;

//     setIsUpdating(true);
//     try {
//       switch (type) {
//         case "label": {
//           const selected = availableLabels.find((l) => l.name === value);
//           if (!selected) return;
//           await ticketService.assignLabel(ticket.id, selected.id);
//           break;
//         }
//         case "priority":
//           await ticketService.changePriority(ticket.id, value);
//           break;
//         case "close":
//           await ticketService.closeTicket(ticket.id);
//           break;
//         default:
//           break;
//       }

//       if (onRefresh) onRefresh();
//     } catch (error) {
//       console.error(`Error actualizando ${type}:`, error);
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   return (
//     <Stack spacing={2}>
//       {isAdmin ? (
//         <>
//           <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
//               <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 1.5 }}>
//               ASIGNAR ADMINISTRADOR
//               </Typography>             <TextField               select
//                fullWidth
//               size="small"
//               //label="Seleccionar admin" 
//               //value={assignedAdmin}
//                 //onChange={(e) => setAssignedAdmin(e.target.value)}
//               sx={{ mb: 2 }}
//             >
//                 <MenuItem value=""><em>Sin asignar</em></MenuItem>
//               <MenuItem value="Carlos Martínez">Carlos Martínez</MenuItem>
//                <MenuItem value="Ana García">Ana García</MenuItem>
//              </TextField>
//              <Button 
//               variant="contained" 
//                fullWidth 
//              onClick={() => handleUpdateTicket({ assignedTo: assignedAdmin })} 
//                disabled={isUpdating}
//                sx={{ bgcolor: "#202B45", textTransform: "none", fontWeight: 700 }}
//              >
//                {isUpdating ? <CircularProgress size={24} color="inherit" /> : "Guardar"}
//               </Button>
//           </Paper>
//           {/* PRIORIDAD */}
//           <Paper sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
//             <Typography
//               variant="caption"
//               sx={{ fontWeight: 700, color: "text.secondary", mb: 1 }}
//             >
//               PRIORIDAD
//             </Typography>

//             <FormControl component="fieldset">
//               <RadioGroup
//                 value={selectedPriority}
//                 onChange={(e) => setSelectedPriority(e.target.value)}
//               >
//                 {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((p) => (
//                   <FormControlLabel
//                     key={p}
//                     value={p}
//                     control={<Radio size="small" />}
//                     label={
//                       <PriorityChip
//                         priority={p}
//                         sxOverrides={{ fontSize: 13, px: 1 }}
//                       />
//                     }
//                   />
//                 ))}
//               </RadioGroup>
//             </FormControl>

//             <Button
//               variant="outlined"
//               fullWidth
//               onClick={() => handleUpdate("priority", selectedPriority)}
//               disabled={selectedPriority === ticket.priority || isUpdating}
//               sx={{ mt: 1, fontWeight: 600, textTransform: "none" }}
//             >
//               {isUpdating ? <CircularProgress size={18} /> : "Cambiar"}
//             </Button>
//           </Paper>

//           {/* ETIQUETAS */}
//           <Paper sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
//             <Typography
//               variant="caption"
//               sx={{ fontWeight: 700, color: "text.secondary", mb: 1 }}
//             >
//               ETIQUETAS
//             </Typography>

//             {/* actuales */}
//             <Box sx={{ mb: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//               {ticket.labels?.map((label, index) => (
//                 <Chip
//                   key={index}
//                   label={label}
//                   size="small"
//                   sx={{
//                     bgcolor: getLabelColor(label),
//                     color: "#fff",
//                     fontWeight: 600,
//                   }}
//                 />
//               ))}
//             </Box>

//             {/* añadir */}
//             <TextField
//               select
//               fullWidth
//               size="small"
//               value=""
//               label="+ Añadir etiqueta"
//               disabled={loading || isUpdating}
//               onChange={(e) => handleUpdate("label", e.target.value)}
//             >
//               {availableLabels.map((label) => (
//                 <MenuItem key={label.id} value={label.name}>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <Box
//                       sx={{
//                         width: 10,
//                         height: 10,
//                         borderRadius: "50%",
//                         bgcolor: label.color,
//                       }}
//                     />
//                     {label.name}
//                   </Box>
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Paper>

//           {/* ESTADO */}
//           <Paper sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
//             <Typography
//               variant="caption"
//               sx={{ fontWeight: 700, color: "text.secondary", mb: 2 }}
//             >
//               ESTADO
//             </Typography>

//             <Stack spacing={1.5}>
//               <InfoRow label="Estado" value={<StatusChip status={ticket.status} />} />
//               <InfoRow label="Prioridad" value={<PriorityChip priority={ticket.priority} />} />
//               <InfoRow label="Creado" value={new Date(ticket.createdAt).toLocaleDateString()} />
//             </Stack>
//           </Paper>

//           <Button
//             variant="contained"
//             fullWidth
//             onClick={() => handleUpdate("close")}
//             sx={{
//               bgcolor: "#F44336",
//               fontWeight: 700,
//               "&:hover": { bgcolor: "#D32F2F" },
//             }}
//           >
//             Cerrar Ticket
//           </Button>
//         </>
//       ) : (
//         /* EMPLEADO */
//         <Paper sx={{ p: 3, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
//           <Typography
//             variant="caption"
//             sx={{ fontWeight: 700, color: "text.secondary", mb: 2 }}
//           >
//             INFORMACIÓN
//           </Typography>

//           <Stack spacing={2}>
//             <InfoRow label="Estado" value={<StatusChip status={ticket.status} />} />
//             <InfoRow label="Prioridad" value={<PriorityChip priority={ticket.priority} />} />
//             <InfoRow label="Fecha" value={new Date(ticket.createdAt).toLocaleDateString()} />
//           </Stack>
//         </Paper>
//       )}
//     </Stack>
//   );
// };

// const InfoRow = ({ label, value }) => (
//   <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//     <Typography variant="body2" color="text.secondary">
//       {label}
//     </Typography>
//     <Box>{value}</Box>
//   </Box>
// );

// export default TicketSidebar;

import {
  Box, Paper, Typography, Stack, TextField, Button, 
  FormControlLabel, Radio, Chip, MenuItem, CircularProgress, 
  Alert, Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup
} from "@mui/material";
import { useEffect, useState } from "react";
import { StatusChip, PriorityChip } from "../common/TicketChips";
import { labelService } from "../../services/labelService";
import { ticketService } from "../../services/ticketService";

const InfoRow = ({ label, value }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
      {label}
    </Typography>
    <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
      {value}
    </Typography>
  </Box>
);

const TicketSidebar = ({ ticket, isAdmin, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [availableLabels, setAvailableLabels] = useState([]);

  // Estado del formulario: aquí vive la "verdad" de lo que el usuario está editando
  const [formData, setFormData] = useState({
    priority: ticket?.priority || "MEDIUM",
    assignedToId: ticket?.assignedTo?.id || "",
    labels: ticket?.labels || [] // Lista de nombres de etiquetas
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        priority: ticket.priority || "MEDIUM",
        assignedToId: ticket.assignedTo?.id || "",
        labels: ticket.labels || []
      });
    }
  }, [ticket]);

  useEffect(() => {
    labelService.getAllLabels()
      .then(data => setAvailableLabels(data.filter(l => l.active)))
      .catch(err => console.error("Error al cargar etiquetas maestras:", err));
  }, []);

  // --- LÓGICA DE ETIQUETAS (SOLO LOCAL) ---
  
  const handleAddLabelLocal = (labelName) => {
    if (!labelName) return;
    // Si la etiqueta no está ya en la lista, la añadimos
    if (!formData.labels.includes(labelName)) {
      setFormData(prev => ({
        ...prev,
        labels: [...prev.labels, labelName]
      }));
    }
  };

  const handleRemoveLabelLocal = (labelName) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.filter(l => l !== labelName)
    }));
  };

  // --- GUARDADO FINAL ---

  const confirmUpdate = async () => {
    setOpenConfirm(false);
    setIsUpdating(true);
    try {
      const promises = [];

      // 1. Prioridad
      if (formData.priority !== ticket.priority) {
        promises.push(ticketService.changePriority(ticket.id, formData.priority));
      }

      // 2. Administrador
      if (formData.assignedToId !== (ticket.assignedTo?.id || "")) {
        promises.push(ticketService.assignAdmin(ticket.id, formData.assignedToId));
      }

      // 3. Etiquetas (Sincronización)
      // Etiquetas que hay que añadir
      const toAdd = formData.labels.filter(l => !ticket.labels.includes(l));
      // Etiquetas que hay que quitar
      const toRemove = ticket.labels.filter(l => !formData.labels.includes(l));

      toAdd.forEach(name => {
        const id = availableLabels.find(al => al.name === name)?.id;
        if (id) promises.push(ticketService.assignLabel(ticket.id, id));
      });

      toRemove.forEach(name => {
        const id = availableLabels.find(al => al.name === name)?.id;
        if (id) promises.push(ticketService.removeLabel(ticket.id, id));
      });

      await Promise.all(promises);
      setIsEditing(false);
      if (onRefresh) onRefresh();
      else {
      window.location.reload(); 
    }
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Stack spacing={2}>
      {/* VISTA LECTURA */}
      <Paper sx={{ p: 2, borderRadius: 2, border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", mb: 2, display: "block" }}>
          INFORMACIÓN DEL TICKET
        </Typography>
        
        <InfoRow label="Estado" value={<StatusChip status={ticket.status} />} />
        <InfoRow label="Prioridad" value={<PriorityChip priority={ticket.priority} />} />
        <InfoRow label="Admin" value={ticket.assignedTo?.name || "Sin asignar"} />
        
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary">Etiquetas</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
            {ticket.labels?.map((l, i) => <Chip key={i} label={l} size="small" />)}
          </Box>
        </Box>

        {isAdmin && !isEditing && (
          <Button fullWidth variant="outlined" size="small" onClick={() => setIsEditing(true)} sx={{ mt: 2 }}>
            Editar Atributos
          </Button>
        )}
      </Paper>

      {/* MODO EDICIÓN */}
      {isAdmin && isEditing && (
        <Paper sx={{ p: 2, borderRadius: 2, bgcolor: "var(--accent-bg)", border: "1px solid var(--accent-border)" }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>MODO EDICIÓN</Typography>

          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>ASIGNAR ADMIN</Typography>
          <TextField select fullWidth size="small" value={formData.assignedToId} 
            onChange={(e) => setFormData({...formData, assignedToId: e.target.value})} sx={{ mb: 2, mt: 0.5, bgcolor: 'background.paper' }}>
            <MenuItem value=""><em>Sin asignar</em></MenuItem>
            <MenuItem value={4}>Admin2 (Tú)</MenuItem>
            <MenuItem value={1}>Carlos Martínez</MenuItem>
            <MenuItem value={2}>Ana García</MenuItem>
          </TextField>

          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>PRIORIDAD</Typography>
          <RadioGroup value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} sx={{ mb: 2 }}>
            {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map(p => (
              <FormControlLabel key={p} value={p} control={<Radio size="small"/>} label={<PriorityChip priority={p} />} />
            ))}
          </RadioGroup>

          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>ETIQUETAS ACTUALES (Click para borrar)</Typography>
          <Box sx={{ mb: 2, mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5, p: 1, border: '1px dashed var(--border)', borderRadius: 1 }}>
            {formData.labels.length > 0 ? formData.labels.map((label) => (
              <Chip 
                key={label} 
                label={label} 
                size="small" 
                onDelete={() => handleRemoveLabelLocal(label)}
              />
            )) : <Typography variant="caption">No hay etiquetas</Typography>}
          </Box>

          <TextField 
            select 
            fullWidth 
            size="small" 
            label="Añadir nueva..." 
            value="" 
            onChange={(e) => handleAddLabelLocal(e.target.value)} 
            sx={{ mb: 2, bgcolor: 'background.paper' }}
          >
            {availableLabels.map(l => (
              <MenuItem key={l.id} value={l.name}>{l.name}</MenuItem>
            ))}
          </TextField>

          <Stack direction="row" spacing={1}>
            <Button fullWidth variant="contained" color="success" onClick={() => setOpenConfirm(true)}>Guardar</Button>
            <Button fullWidth variant="outlined" onClick={() => setIsEditing(false)}>Cancelar</Button>
          </Stack>
        </Paper>
      )}

      {isAdmin && ticket.status !== 'CLOSED' && (
        <Button variant="contained" fullWidth onClick={() => ticketService.closeTicket(ticket.id).then(() => onRefresh())}
          sx={{ bgcolor: "#F44336", fontWeight: 700 }}>
          Cerrar Ticket
        </Button>
      )}

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>¿Confirmar cambios?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>No</Button>
          <Button onClick={confirmUpdate} variant="contained">Sí, guardar</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default TicketSidebar;