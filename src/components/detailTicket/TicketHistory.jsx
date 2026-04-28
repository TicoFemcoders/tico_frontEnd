import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/useAuth";
import { Paper, Typography, Box, Stack, Divider, CircularProgress} from "@mui/material";
import { ticketMessageService } from "../../services/ticketMessageService";
import UserAvatar from "../common/UserAvatar";
import { useSnackbar } from "notistack";
import LoadingScreen from "../common/LoadingScreen";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import InfiniteScrollFooter from "../common/InfiniteScrollFooter";

const TicketHistory = ({ ticketId, refreshTrigger }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { page, setPage, handleScroll, scrollRef, canScroll, isAtBottom } = useInfiniteScroll(loading, hasMore, messages);

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const fetchMessages = useCallback(async (currentPage, isRefresh = false) => {
    if (!ticketId) return;
    if (loading && !isRefresh) return; 
    try {
      const data = await ticketMessageService.getMessagesByTicketId(ticketId, currentPage, 10);
      const safeData = data || [];
      setMessages(prev => {
        const base = isRefresh ? [] : prev;
        const existingIds = new Set(base.map(m => m.id));
        const unique = safeData.filter(m => !existingIds.has(m.id));
        return [...base, ...unique].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      });
      setHasMore(safeData.length === 10); 
    } catch (err) {
      enqueueSnackbar(err.friendlyMessage || "Error al cargar historial", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [ticketId, enqueueSnackbar ]);

  useEffect(() => {
    fetchMessages(page, false);
  }, [page, fetchMessages]);

  useEffect(() => {
    if (refreshTrigger > 0) {
      setPage(0);
      setHasMore(true);
      fetchMessages(0, true);
    }
  }, [refreshTrigger, fetchMessages]);

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

        <Box 
          ref={scrollRef}
          onScroll={handleScroll}
          sx={{ 
            maxHeight: 400, 
            overflowY: 'auto', 
            pr: 1 
          }}
        >
        {loading && messages.length === 0 ? (
          <LoadingScreen minHeight="200px" />
        ) : (
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
          <InfiniteScrollFooter 
                loading={loading} 
                hasMore={hasMore} 
                isEmpty={messages.length === 0} 
                scrollText={null} 
                endText="— Fin del historial —" 
            />
        </Stack>
      )}
      </Box>
      {canScroll && !isAtBottom && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, opacity: 0.7 }}>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            ↓ Sigue deslizando para leer más
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default TicketHistory;
