import { Paper, Typography, Box, Divider } from "@mui/material";

const TicketDescription = ({ description, createdAt }) => {

  const formatDateTime = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return "Fecha inválida";

    const dateFormatted = date.toLocaleDateString();
    const timeFormatted = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return `${dateFormatted} a las ${timeFormatted}`;
  };

  return (
    <Paper sx={{ 
      width: '100%', 
      boxSizing: 'border-box', 
      borderRadius: 2, 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
      border: '1px solid',
      borderColor: 'border.soft',
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        p: 1.5, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: 'rgba(0,0,0,0.02)' 
      }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
          Descripción del empleado
        </Typography>
        
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 400 }}>
          {formatDateTime(createdAt)}
        </Typography>
      </Box>

      <Divider /> 

      <Box sx={{ p: 2 }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', color: 'text.mid' }}>
          {description}
        </Typography>
      </Box>
    </Paper>
  );
};

export default TicketDescription;