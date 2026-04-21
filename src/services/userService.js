import { api } from "./api";

export const getAllUsers = () =>
  api.get("/api/users").then(res => res.data);

export const getUserById = (userId) =>
  api.get(`/api/users/${userId}`).then(res => res.data);

export const getUserActiveTickets = (userId) =>
  api.get(`/api/tickets/my-tickets?userId=${userId}`)
     .then(res => res.data.filter(t => t.status !== "CLOSED"));


export const deleteUser = (userId, reassignEmail) => {
  const url = reassignEmail
    ? `/api/users/${userId}?reassignEmail=${reassignEmail}`
    : `/api/users/${userId}`;
  return api.delete(url);
};

export const createUser = (formData) =>
  api.post(`api/users`, formData);

export const getAllAdmins = () =>
  api.get("/api/users/admins").then(res => res.data);

export const updateUser = (userId, formData) =>
  api.put(`/api/users/${userId}`, formData);

export const toggleUserActive = () =>
  api.patch(`api/users/${userId}/active`);

export const userService = {
  getAllUsers,
  getUserById,
  getUserActiveTickets,
  deleteUser,
  createUser,
  getAllAdmins,
  updateUser,
  toggleUserActive
}