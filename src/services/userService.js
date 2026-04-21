import { api } from "./api";

export const getAllUsers = async () => {
    // const response = await api.get("/api/users");
    // return response.data;

    return [
        { id: 1, name: "Ana García", email: "ana@cohispania.com", role: "ADMIN", isActive: true, openTickets: 0 },
        { id: 2, name: "Luis Martínez", email: "luis@cohispania.com", role: "EMPLOYEE", isActive: true, openTickets: 3 },
        { id: 3, name: "María López", email: "maria@cohispania.com", role: "EMPLOYEE", isActive: false, openTickets: 1 },
    ];
};

export const deleteUser = async (id) => {
    // const response = await api.delete(`/api/users/${id}`);
    // return response.data;
};