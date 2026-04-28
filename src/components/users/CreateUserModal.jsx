import React, { useState } from "react";
import { Box, TextField, MenuItem, Button, Typography } from "@mui/material";
import AppModal from "../common/AppModal";
import UserForm from "./UserForm";

const CreateUserModal = ({ open, onClose, onCreate, onError }) => {
    const [formData, setFormData] = useState({ name: "", email: "", roles: ["EMPLOYEE"] });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            await onCreate(formData);
            setFormData({ name: "", email: "", roles: ["EMPLOYEE"] });
            onClose();
        } catch (err) {
            onError(err);
        }
    };

    const handleClose = () => {
        setFormData({ name: "", email: "", roles: ["EMPLOYEE"] });
        onClose();
    };

    return (
        <AppModal
            open={open}
            onClose={handleClose}
            title="Crear Usuario"
            maxWidth="sm"
            actions={
                <>
                    <Button variant="outlined" onClick={handleClose}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSubmit}>Crear Usuario</Button>
                </>
            }
        >
            <UserForm
            formData={formData}
            onChange={handleChange}
            subtitle="Rellena los datos del nuevo usuario"
        />
        </AppModal>
    );
};

export default CreateUserModal;