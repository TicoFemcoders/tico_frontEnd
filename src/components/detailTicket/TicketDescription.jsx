import { Paper, Typography } from "@mui/material";

// const TicketDescription = ({ description }) => {
//   return (
//     <Paper
//       sx={{
//         p: 2,
//         mb: 2,
//         borderRadius: 2,
//         border: "1px solid",
//         borderColor: "border.soft",
//       }}
//     >
//       <Typography variant="subtitle2" sx={{ mb: 1 }}>
//         Descripción inicial
//       </Typography>

//       <Typography variant="body2" color="text.secondary">
//         {description}
//       </Typography>
//     </Paper>
//   );
// };
const TicketDescription = ({ description }) => (
  <Paper sx={{ 
  p: 3, 
  width: '100%', // Esto es clave
  boxSizing: 'border-box', 
  borderRadius: 2, 
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)', // Sombra sutil
  border: '1px solid',
  borderColor: 'border.soft'
}}>
    <Typography variant="subtitle2" gutterBottom color="text.primary">
      Descripción del empleado
    </Typography>
    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
      {description}
    </Typography>
  </Paper>
);

export default TicketDescription;