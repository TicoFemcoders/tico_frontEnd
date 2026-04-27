import { Box, Typography, Stack, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import EnumChip from "../common/EnumChip";
import TicketLabels from "./TicketLabels";
import LatestDateInfo from "./LatestDateInfo";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "../../utils/enums";

export default function TicketCardMobile({ ticket, variant, fromPath }) {
    const isAdmin = ["assigned", "all"].includes(variant);
    const linkText = isAdmin ? "GESTIONAR" : "VER";
    return (
        <Box component="article" sx={{ mb: 3, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'border.soft' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>TIC-{ticket.id}</Typography>
                <EnumChip value={ticket.status} config={STATUS_CONFIG} type="status" />
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>{ticket.title}</Typography>
            {isAdmin && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontSize: '11px' }}>
                    Empleado: <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{ticket.createdByName || "Desconocido"}</Box>
                </Typography>
            )}
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2, gap: 0.5, alignItems: 'center' }}>
                <TicketLabels labels={ticket.labels} />
                <EnumChip value={ticket.priority} config={PRIORITY_CONFIG} type="priority" />
            </Stack>
            {variant === "all" && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontSize: '11px' }}>
                    Asignado a: <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{ticket.assignedToName || "Sin asignar"}</Box>
                </Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <LatestDateInfo ticket={ticket} />
                <Link component={RouterLink} to={`/detail-ticket/${ticket.id}`} state={{ fromPath }} sx={{ fontWeight: 700, fontSize: "11px" }}>
                    {linkText}
                </Link>
            </Box>
        </Box>
    );
}