// import { Paper, Typography, Box, Button, Stack } from "@mui/material";
// import { StatusChip, PriorityChip } from "../common/TicketChips";

// const TicketSidebar = ({ ticket, isAdmin }) => {
//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

//       {isAdmin && (
//         <Paper sx={{ p: 2, borderRadius: 2 }}>
//           <Typography variant="subtitle2" sx={{ mb: 1 }}>
//             Acciones
//           </Typography>

//           <Stack spacing={1}>
//             <Button variant="contained" fullWidth>
//               Asignar agente
//             </Button>

//             <Button variant="outlined" color="error" fullWidth>
//               Cerrar ticket
//             </Button>
//           </Stack>
//         </Paper>
//       )}

//       <Paper sx={{ p: 2, borderRadius: 2 }}>
//         <Typography variant="subtitle2" sx={{ mb: 1 }}>
//           Estado
//         </Typography>

//         <StatusChip status={ticket.status} />
//       </Paper>

//       <Paper sx={{ p: 2, borderRadius: 2 }}>
//         <Typography variant="subtitle2" sx={{ mb: 1 }}>
//           Prioridad
//         </Typography>

//         <PriorityChip priority={ticket.priority} />
//       </Paper>

//       <Paper sx={{ p: 2, borderRadius: 2 }}>
//         <Typography variant="subtitle2" sx={{ mb: 1 }}>
//           Etiquetas
//         </Typography>

//         <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
//           {ticket.labels?.map((l, i) => (
//             <Box key={i} sx={{ mb: 1 }}>
//               {l}
//             </Box>
//           ))}
//         </Stack>
//       </Paper>

//     </Box>
//   );
// };

import {
  Paper,
  Typography,
  Box,
  Button,
  Stack,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from "@mui/material";
import { StatusChip, PriorityChip } from "../common/TicketChips";

const TicketSidebar = ({ ticket, isAdmin }) => {
  return (
    <Stack spacing={2}>
      {isAdmin && (
        <>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1,
                fontWeight: 700,
                color: "text.secondary",
                textTransform: "uppercase",
                fontSize: "10px",
              }}
            >
              Asignar Administrador
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="Reasignar a..."
              sx={{ mb: 1 }}
            />
            <Button variant="contained" fullWidth sx={{ bgcolor: "#202B45" }}>
              Guardar
            </Button>
          </Paper>

          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1,
                fontWeight: 700,
                color: "text.secondary",
                textTransform: "uppercase",
                fontSize: "10px",
              }}
            >
              Prioridad
            </Typography>
            <RadioGroup defaultValue={ticket.priority}>
              <FormControlLabel
                value="CRITICAL"
                control={<Radio size="small" color="error" />}
                label="Urgente"
              />
              <FormControlLabel
                value="HIGH"
                control={<Radio size="small" color="warning" />}
                label="Alta"
              />
              <FormControlLabel
                value="MEDIUM"
                control={<Radio size="small" />}
                label="Media"
              />
              <FormControlLabel
                value="LOW"
                control={<Radio size="small" color="success" />}
                label="Baja"
              />
            </RadioGroup>
            <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
              Cambiar
            </Button>
          </Paper>
        </>
      )}

      <Paper sx={{ p: 3, borderRadius: 2, width: "100%" }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: "text.secondary",
            mb: 2,
            display: "block",
          }}
        >
          ESTADO
        </Typography>

        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2">Actual</Typography>
            <StatusChip status={ticket.status} />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Empleado</Typography>
            <Typography variant="body2" fontWeight={600}>
              Ana García
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Fecha creación</Typography>
            <Typography variant="body2" color="error.main" fontWeight={700}>
              26/02/2025
            </Typography>
          </Box>

          {isAdmin && (
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                bgcolor: "#f44336", // Rojo vibrante
                "&:hover": { bgcolor: "#d32f2f" },
                fontWeight: 700,
                py: 1.5,
                textTransform: "none",
              }}
            >
              Cerrar ticket
            </Button>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default TicketSidebar;
