import { useState, useEffect } from "react";
import { Box, TextField, MenuItem, Button, Typography } from "@mui/material";
import AppModal from "../common/AppModal";
import UserForm from "./UserForm";

const EditUserModal = ({ open, onClose, onEdit, onError, onToggle, onNeedsReassign, user }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        roles: ["EMPLOYEE"],
        isActive: true,
    });

    useEffect(() => {
        if (user) setFormData({
            name: user.name || "",
            email: user.email || "",
            roles: [
                (Array.isArray(user.roles) ? user.roles[0] : user.roles || "EMPLOYEE")
                    .replace("ROLE_", "")
            ],
            isActive: user.isActive ?? true,
        });
    }, [user]);

    const handleSubmit = async () => {
        const deactivating = user.isActive && !formData.isActive;
        const statusChanging = user.isActive !== formData.isActive;

        if (deactivating && user.openTickets > 0) {
            onNeedsReassign(user);
            return;
        }

        try {
            await onEdit(user.id, { name: formData.name, email: formData.email, roles: formData.roles });
            if (statusChanging) await onToggle(user.id);
            onClose();
        } catch (err) {
            onError(err);
        }
    };

    return (
        <AppModal
            open={open}
            onClose={onClose}
            title="Editar Usuario"
            maxWidth="sm"
            actions={
                <>
                    <Button color="inherit" onClick={onClose}>Cancelar</Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Guardar Cambios</Button>
                </>
            }
        >
            <UserForm
            formData={formData}
            onChange={(e) => {
                const { name, value } = e.target;
                setFormData(prev => ({ ...prev, [name]: value }));
            }}
            subtitle="Modifica los datos del usuario"
            showStatus
        />
        </AppModal>
    );
};

export default EditUserModal;
