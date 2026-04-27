import { Stack, Box, Typography } from "@mui/material";
import { Update as UpdateIcon, CheckCircle as CheckIcon, AddCircle as AddIcon } from "@mui/icons-material";
const ICONS = {
    Creado: <AddIcon fontSize="inherit" />,
    Modificado: <UpdateIcon fontSize="inherit" />,
    Cerrado: <CheckIcon fontSize="inherit" />
};
function getLatestDate(ticket) {
    const dates = [
        { label: 'Creado', value: new Date(ticket.createdAt), color: 'text.primary'},
        { label: 'Modificado', value: new Date(ticket.updatedAt), color: 'text.primary'},
    ];
    if (ticket.closedAt) {
        dates.push({ label: 'Cerrado', value: new Date(ticket.closedAt), color: "dateStatus.closed" });
    }
    const latest = dates.sort((a, b) => b.value - a.value)[0];
    return { ...latest, value: latest.value.toLocaleDateString() };
}
export default function LatestDateInfo({ ticket, compact = false }) {
    const latest = getLatestDate(ticket);
    if (compact) {
        return (
            <Typography variant="caption" sx={{ color: latest.color, display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
                {ICONS[latest.label]} {latest.label}: {latest.value}
            </Typography>
        );
    }
    return (
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: latest.color }}>
            {/* {ICONS[latest.label]} */}
            <Box>
                {/* <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, lineHeight: 1 }}>{latest.label}</Typography> */}
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{latest.value}</Typography>
            </Box>
        </Stack>
    );
}