import { Box, Link, Tooltip } from "@mui/material";
import { Lock as LockIcon } from "@mui/icons-material";
const actionLinkSx = (color) => ({
    textDecoration: "none",
    fontWeight: 700,
    color,
    fontSize: "12px",
    border: "none",
    bgcolor: "transparent",
    cursor: "pointer",
});
const LabelActionsCell = ({ label, isInactiveVariant, onEdit, onToggle }) => {
    const canToggleOff = label.activeTickets === 0;
    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {!isInactiveVariant && onEdit && (
                <Box sx={{ width: 70, display: "flex", justifyContent: "center" }}>
                    <Link
                        component="button"
                        onClick={() => onEdit(label)}
                        sx={actionLinkSx("primary.main")}
                    >
                        EDITAR
                    </Link>
                </Box>
            )}
            <Box sx={{ width: 110, display: "flex", justifyContent: "center" }}>
                {isInactiveVariant ? (
                    <Link
                        component="button"
                        onClick={() => onToggle(label)}
                        sx={actionLinkSx("success.main")}
                    >
                        ACTIVAR
                    </Link>
                ) : (
                    <Tooltip
                        title={!canToggleOff
                            ? "Tiene tickets activos. Resuélvelos antes de desactivar."
                            : "Desactivar etiqueta"
                        }
                        disableHoverListener={canToggleOff}
                    >
                        <span style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                            <Link
                                component="button"
                                disabled={!canToggleOff}
                                onClick={() => canToggleOff && onToggle(label)}
                                sx={{
                                    ...actionLinkSx(canToggleOff ? "error.main" : "text.disabled"),
                                    cursor: canToggleOff ? "pointer" : "not-allowed",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5
                                }}
                            >
                                {!canToggleOff && <LockIcon sx={{ fontSize: 14 }} />}
                                DESACTIVAR
                            </Link>
                        </span>
                    </Tooltip>
                )}
            </Box>
        </Box>
    );
};
export default LabelActionsCell;