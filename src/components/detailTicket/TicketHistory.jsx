import { useEffect, useState } from "react";
import useAuth from "../../context/useAuth";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
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
        const sorted = data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
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
    <Paper
      sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'border.soft', boxShadow: 'var(--shadow)' }}
    >
      <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 700 }}>
        Historial de Mensajes
      </Typography>
      
      <Divider sx={{ mb: 3, borderColor: 'var(--border)' }} />

      <Stack spacing={3}>
        {messages.map((item) => (
          <Box key={item.id}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}
              >
              <Typography
                variant="body2"
                fontWeight={800}
                color="text.primary"
                sx={{ fontWeight: "bold" }}
              >
                {item.authorName || `Usuario #${item.authorId}`}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {new Date(item.createdAt).toLocaleString([],{
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
              </Typography>

            </Box>

            <Typography variant="body2" sx={{ mt: 1, whiteSpace: "pre-line" }}>
              {item.content}
            </Typography>
            
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
        {messages.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            No hay mensajes aún.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default TicketHistory;
