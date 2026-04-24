import { Chip } from "@mui/material";

export const PriorityChip = ({ priority, sxOverrides }) => {
    const config = {
        'CRITICAL': { label: 'Urgente', key: 'urgent' },
        'HIGH':     { label: 'Alta',    key: 'high' },
        'MEDIUM':   { label: 'Media',   key: 'medium' },
        'LOW':      { label: 'Baja',    key: 'low' }
    };
    const data = config[priority] || config['LOW'];

    return (
        <Chip
            label={data.label}
            size="small"
            sx={{
                bgcolor: `priority.${data.key}.bg`,
                color:   `priority.${data.key}.text`,
                fontWeight: 600,
                ...sxOverrides
            }}
        />
    );
};

export default PriorityChip;