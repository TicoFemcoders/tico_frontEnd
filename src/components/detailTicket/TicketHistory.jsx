import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/useAuth";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import { ticketMessageService } from "../../services/ticketMessageService";
import UserAvatar from "../common/UserAvatar";

const TicketHistory = ({ ticketId, refreshTrigger }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMessages = useCallback(async () => {
    if (!ticketId) return;
    try {
      const data = await ticketMessageService.getMessagesByTicketId(ticketId);
      const safeData = data || [];
      const sorted = [...safeData].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
      setMessages(sorted);
    } catch (err) {
      console.error("Error al cargar mensajes:", err);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages, refreshTrigger]);

  if (loading && messages.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Paper
      sx={{ 
        p: 3, 
        borderRadius: 2, 
        backgroundColor: 'background.paper', 
        border: '1px solid', 
        borderColor: 'var(--border)', 
        boxShadow: 'var(--shadow)'    
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 700 }}>
        Historial de Mensajes
      </Typography>
      
      <Divider sx={{ mb: 3, borderColor: 'var(--border)' }} />

      <Stack spacing={3}>
        {messages.map((item) => (
          <Box key={item.id}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
              <UserAvatar 
                name={typeof item.authorName === 'object' ? item.authorName.name : item.authorName} 
                role={item.authorRole} 
              />
              <Typography
                variant="body2"
                sx={{ 
                  fontWeight: 800, 
                  color: "text.primary" 
                }}
              >
                {typeof item.authorName === 'object' 
                  ? item.authorName.name 
                  : (item.authorName || `Usuario #${item.authorId}`)}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {new Date(item.createdAt).toLocaleString([], {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ mt: 1, whiteSpace: "pre-line", pl: 6, py:1 }}>
              {item.content}
            </Typography>
            
            <Divider sx={{ mt: 2, borderColor: 'var(--border)', opacity: 0.5 }} />
          </Box>
        ))}

        {messages.length === 0 && !loading && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: "italic", pl: 6, py:2 }}
          >
            No hay mensajes aún.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default TicketHistory;
