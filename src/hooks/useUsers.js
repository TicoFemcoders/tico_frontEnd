import { useState, useEffect, useCallback } from "react";
import { useSnackbar } from "notistack";
import { userService } from "../services/userService";

export const useUsers = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [users, setUsers]   = useState([]);
    const [loading, setLoading] = useState(true);

    const notify = useCallback((msg, variant = "success") => {
        enqueueSnackbar(msg, { variant });
    }, [enqueueSnackbar]);

    const handleError = useCallback((err, fallback = "Error inesperado") => {
        enqueueSnackbar(err.friendlyMessage || fallback, { variant: "error" });
    }, [enqueueSnackbar]);

    const fetchUsers = useCallback(async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (err) {
            handleError(err, "Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const createUser = async (formData) => {
        await userService.createUser(formData);
        await fetchUsers();
        notify("Usuario creado correctamente");
    };

    const updateUser = async (userId, formData) => {
        await userService.updateUser(userId, formData);
        await fetchUsers();
        notify("Usuario actualizado correctamente");
    };

    const deleteUser = async (userId, reassignEmail) => {
        await userService.deleteUser(userId, reassignEmail);
        await fetchUsers();
        notify("Usuario eliminado correctamente");
    };

    return {
        users,
        loading,
        createUser,
        updateUser,
        deleteUser,
        handleError,
    };
};