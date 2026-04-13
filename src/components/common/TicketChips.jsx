import { Chip } from "@mui/material";
export const StatusChip = ({ status, sxOverrides }) => {
    const config = {
        'OPEN': { label: 'Abierto', key: 'open' },
        'IN_PROGRESS': { label: 'En curso', key: 'inProg' },
        'CLOSED': { label: 'Cerrado', key: 'closed' }
    };
    const data = config[status] || config['OPEN']; 
    
    return (
        <Chip 
            label={data.label} 
            size="small" 
            sx={{ 
                bgcolor: `status.${data.key}.bg`, 
                color: `status.${data.key}.text`, 
                fontWeight: 600,
                ...sxOverrides 
            }} 
        />
    );
};
export const PriorityChip = ({ priority, sxOverrides }) => {
    const config = {
        'CRITICAL': { label: 'Urgente', key: 'urgent' },
        'HIGH': { label: 'Alta', key: 'high' },
        'MEDIUM': { label: 'Media', key: 'medium' },
        'LOW': { label: 'Baja', key: 'low' }
    };
    const data = config[priority] || config['LOW']; 
    
    return (
        <Chip 
            label={data.label} 
            size="small" 
            sx={{ 
                bgcolor: `priority.${data.key}.bg`, 
                color: `priority.${data.key}.text`,
                ...sxOverrides 
            }} 
        />
    );
};