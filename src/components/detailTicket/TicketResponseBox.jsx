import { Paper, TextField, Button, Box } from "@mui/material";
import { useState } from "react";

// const TicketResponseBox = () => {
//   return (
//     <Paper sx={{ p: 2 }}>
//       <TextField
//         fullWidth
//         multiline
//         rows={3}
//         placeholder="Escribe una respuesta..."
//       />

//       <Button variant="contained" sx={{ mt: 2 }}>
//         Enviar
//       </Button>
//     </Paper>
//   );
// };

const TicketResponseBox = () => {
  const [text, setText] = useState("");
  return (
    <Paper sx={{ 
  p: 3, 
  width: '100%', // Esto es clave
  boxSizing: 'border-box', 
  borderRadius: 2, 
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)', // Sombra sutil
  border: '1px solid',
  borderColor: 'border.soft'
}}>
      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="Escribe una respuesta para el empleado..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button variant="contained" color="primary">Enviar respuesta</Button>
      </Box>
    </Paper>
  );
};

export default TicketResponseBox;