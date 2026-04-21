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

export const getUserById = (userId) =>
    api.get(`/api/users/${userId}`).then(res => res.data);

export const deleteUser = (userId, reassignEmail) =>
    api.delete(`/api/users/${userId}?reassignEmail=${reassignEmail}`);

export const getUserActiveTickets = (userId) =>
    api.get(`/api/tickets/my-tickets?userId=${userId}`)
        .then(res => res.data.filter(t => t.status !== "CLOSED"));