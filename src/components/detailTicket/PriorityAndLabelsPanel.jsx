import { useState } from "react";
import { Paper, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Box, TextField, MenuItem, Button } from "@mui/material";
import { useBlocker } from "react-router-dom";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EnumChip from "../common/EnumChip";
import LabelChip from "../common/LabelChip";
import ConfirmModal from "../modals/ConfirmModal";
import { useTicketAttributes } from "../../hooks/useTicketAttributes";
import { TICKET_PRIORITY, PRIORITY_CONFIG } from "../../utils/enums";
import { useSnackbar } from "notistack";


const PriorityAndLabelsPanel = ({ ticket, isAssignedToMe, isClosed, onRefresh }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const {
        formData, setFormData,
        availableLabels,
        isUpdating,
        addLabel, removeLabel,
        confirmUpdate,
    } = useTicketAttributes({ ticket, onRefresh });

    const canEdit = isAssignedToMe && !isClosed;

    const blocker = useBlocker(isEditing);

    const handleConfirm = async () => {
        setOpenConfirm(false);
        await confirmUpdate();
        setIsEditing(false);
    };

    return (
        <>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "background.paper", border: "1px solid", borderColor: "border.soft" }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 1.5 }}>
                    PRIORIDAD
                </Typography>
                <FormControl component="fieldset" disabled={!isEditing} sx={{ width: "100%", mb: 2 }}>
                    <RadioGroup
                        value={formData.priority}
                        onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    >
                        {Object.values(TICKET_PRIORITY).map(p => (
                            <FormControlLabel
                                key={p} value={p}
                                control={<Radio size="small" />}
                                label={<EnumChip value={p} config={PRIORITY_CONFIG} type="priority" sxOverrides={{ fontSize: 12 }} />}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>

                <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", mb: 1, display: "block" }}>
                    ETIQUETAS
                </Typography>
                <Box sx={{ mb: 1.5, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {formData.labels.map((l, i) => (
                        <LabelChip
                            key={i} label={l} size="small"
                            onDelete={isEditing ? () => removeLabel(typeof l === "object" ? l.name : l) : undefined}
                        />
                    ))}
                </Box>
                {isEditing && (
                    <TextField
                        select fullWidth size="small" label="+ Añadir etiqueta" value=""
                        onChange={e => addLabel(e.target.value)}
                    >
                       {availableLabels.map(l => (
                            <MenuItem key={l.id} value={l.name} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: l.color || "grey.300" }} />
                                {l.name}
                            </MenuItem>
                        ))}
                    </TextField>
                )}

                <Button
                    fullWidth
                    variant={isEditing ? "contained" : "outlined"}
                    color={isEditing ? "success" : "primary"}
                    size="small"
                    onClick={isEditing
                        ? () => setOpenConfirm(true)
                        : () => { if (isClosed) return; canEdit ? setIsEditing(true) : 
                            enqueueSnackbar(`Solo el administrador asignado (${ticket?.assignedToName}) puede editar la prioridad y etiquetas.`, { variant: "warning" });; }
                    }
                    disabled={isUpdating}
                    sx={{ mt: 2, textTransform: "none", borderRadius: 1.5 }}
                >
                    {isEditing ? "Guardar Cambios" : isClosed ? "Ticket Cerrado" : "Cambiar"}
                </Button>
                {isEditing && (
                    <Button fullWidth size="small" sx={{ mt: 1, textTransform: "none" }} onClick={() => setIsEditing(false)}>
                        Cancelar
                    </Button>
                )}
            </Paper>

            <ConfirmModal
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleConfirm}
                title="¿Guardar cambios?"
                confirmLabel="Confirmar"
                confirmColor="success"
            />

            <ConfirmModal
                open={blocker.state === "blocked"}
                onClose={() => blocker.reset?.()}
                onConfirm={() => blocker.proceed?.()}
                title="¿Salir sin guardar?"
                confirmLabel="Salir sin guardar"
                confirmColor="error"
                cancelLabel="Volver"
            >
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                    <WarningAmberIcon sx={{ color: "warning.main", mt: 0.3 }} />
                    <Typography variant="body2">
                        Tienes cambios sin guardar en prioridad o etiquetas. Si sales ahora se perderán.
                    </Typography>
                </Box>
            </ConfirmModal>
        </>
    );
};

export default PriorityAndLabelsPanel;