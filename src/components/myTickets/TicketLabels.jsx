import { Box, Typography } from "@mui/material";
import LabelChip from "../common/LabelChip";

export default function TicketLabels({ labels = [] }) {
    const MAX_VISIBLE = 4;
    const visible = labels.slice(0, MAX_VISIBLE);
    const remaining = labels.length - MAX_VISIBLE;
    return (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center', maxWidth: 180 }}>
            {visible.map((label, i) => (
                <LabelChip key={i} label={label} />
            ))}
            {remaining > 0 && (
                <Typography variant="caption" sx={{ color: 'text.subtle', fontWeight: 600 }}>
                    +{remaining}
                </Typography>
            )}
        </Box>
    );
}