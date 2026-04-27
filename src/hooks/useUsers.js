import { useState, useEffect, useCallback } from "react";
import { useSnackbar } from "notistack";
import { userService } from "../services/userService";
import { useProgressiveFetch } from "./useProgressiveFetch";

export const useUsers = () => {
    const { enqueueSnackbar } = useSnackbar();

    const notify = useCallback((msg, variant = "success") => {
        enqueueSnackbar(msg, { variant });
    }, [enqueueSnackbar]);

    const handleError = useCallback((err, fallback = "Error inesperado") => {
        enqueueSnackbar(err.friendlyMessage || fallback, { variant: "error" });
    }, [enqueueSnackbar]);

    const fetchFn = useCallback((page, size) => userService.getAllUsers(page, size), []);

    const { data: users, loading, isSyncing, refetch: fetchUsers } = useProgressiveFetch(fetchFn);

    const createUser = async (formData) => {
        await userService.createUser(formData);
        await fetchUsers();
        notify("Usuario creado correctamente");
    };

    const updateAndToggleUser = async (userId, formData, shouldToggle) => {
        await userService.updateUser(userId, formData);
        if (shouldToggle) {
            await userService.toggleUserActive(userId);
        }
        await fetchUsers();
        notify("Usuario actualizado correctamente");
    };

    const deactivateUser = async (userId, reassignEmail) => {
        await userService.deactivateUser(userId, reassignEmail);
        await fetchUsers();
        notify("Usuario desactivado correctamente");
    };

    const activeUsers   = users.filter(u => u.isActive);
    const inactiveUsers = users.filter(u => !u.isActive);

    return {
        users,
        activeUsers,
        inactiveUsers,
        loading,
        isSyncing,
        createUser,
        deactivateUser,
        handleError,
        updateAndToggleUser
    };
};