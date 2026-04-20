 //import { Paper, Typography, Box, Stack, Divider } from "@mui/material";

// const TicketHistory = ({ history = [] }) => {
//   return (
//     <Paper sx={{ 
//   p: 3, 
//   width: '100%', 
//   boxSizing: 'border-box', 
//   borderRadius: 2, 
//   boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//   border: '1px solid',
//   borderColor: 'border.soft'
// }}>

//       <Typography variant="subtitle2" sx={{ mb: 2 }}>
//         Historial
//       </Typography>

//       <Stack spacing={2}>
//         {history.map((item, i) => (
//           <Box key={i}>

//             <Typography variant="body2" fontWeight={600}>
//               {item.author}
//             </Typography>

//             <Typography variant="caption" color="text.secondary">
//               {item.date}
//             </Typography>

//             <Typography variant="body2" sx={{ mt: 0.5 }}>
//               {item.message}
//             </Typography>

//             {i !== history.length - 1 && (
//               <Divider sx={{ mt: 1.5 }} />
//             )}

//           </Box>
//         ))}
//       </Stack>

//     </Paper>
//   );
// };

import { useEffect, useState } from "react";
import useAuth from "../../context/useAuth";
import { Paper, Typography, Box, Stack, Divider, CircularProgress } from "@mui/material";
import { ticketMessageService } from "../../services/ticketMessageService";

const TicketHistory = ({ ticketId, refreshTrigger }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();

  useEffect(() => {
    if (!ticketId) return;
    const fetchMessages = async () => {
      try {
        const data = await ticketMessageService.getMessagesByTicketId(ticketId);
        const sorted = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setMessages(sorted);
      } catch (err) {
        console.error("Error al cargar mensajes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
  }, [ticketId, refreshTrigger]);

  if (loading) return <CircularProgress size={24} sx={{ m: 2 }} />;

  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 700 }}>
        Historial de Mensajes
      </Typography>
      <Stack spacing={3}>
        {messages.map((item) => (
          <Box key={item.id}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Typography variant="body2" fontWeight={700} color="text.primary" sx={{ fontWeight: 'bold' }}>
                {item.authorName || `Usuario #${item.authorId}`}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(item.createdAt).toLocaleString()}
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
              {item.content}
            </Typography>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
        {messages.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            No hay mensajes aún.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default TicketHistory;

