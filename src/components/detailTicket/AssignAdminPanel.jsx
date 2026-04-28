import React, { useState, useEffect } from "react";
import { Paper, Typography, TextField, MenuItem, Button } from "@mui/material";
import { userService } from "../../services/userService";
import { ticketService } from "../../services/ticketService";
import { useSnackbar } from "notistack";

const AssignAdminPanel = ({ ticket, onRefresh }) => {
    const [admins, setAdmins] = useState([]);
    const [assignedToId, setAssignedToId] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const controller = new AbortController();
        userService.getAllAdmins()
            .then(data => { if (!controller.signal.aborted) setAdmins(data); })
            .catch(() => {});
        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (ticket && admins.length > 0) {
            const matched = admins.find(a => a.name === ticket.assignedToName);
            setAssignedToId(matched?.id ?? "");
        }
    }, [ticket, admins]);

    const handleReassign = async () => {
        setIsUpdating(true);
        try {
            await ticketService.assignAdmin(ticket.id, Number(assignedToId));
            await onRefresh?.();
            enqueueSnackbar("Responsable actualizado correctamente.", { variant: "success" });
        } catch (error) {
        enqueueSnackbar(error.friendlyMessage || "Error al reasignar administrador.", { variant: "error" });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "background.paper", border: "1px solid", borderColor: "border.soft" }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 1.5 }}>
                    ASIGNAR ADMINISTRADOR
                </Typography>
                <TextField
                    select fullWidth size="small"
                    value={assignedToId}
                    onChange={e => setAssignedToId(e.target.value)}
                    sx={{ mb: 1.5 }}
                >
                    {admins.map(admin => (
                        <MenuItem key={admin.id} value={admin.id}>{admin.name}</MenuItem>
                    ))}
                </TextField>
                <Button
                    fullWidth variant="contained" size="small"
                    onClick={handleReassign}
                    disabled={isUpdating || !assignedToId}
                    sx={{ bgcolor: "secondary.main", "&:hover": { bgcolor: "secondary.dark" } }}
                >
                    Guardar
                </Button>
            </Paper>
        </>
    );
};

export default AssignAdminPanel;