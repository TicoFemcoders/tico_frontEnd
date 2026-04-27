import { api } from "./api";

export const getAllUsers = (page = 0, size = 50) =>
  api.get(`/api/users`, { params: { page, size } }).then(res => res.data.content);

export const getAllAdmins = () =>
  api.get("/api/users/admins").then(res => res.data.content);

export const getUserById = (userId) =>
  api.get(`/api/users/${userId}`).then(res => res.data);

export const getUserActiveTickets = (userId) =>
  api.get(`/api/tickets/my-tickets`, { params: { userId } })
    .then(res => res.data.filter(t => t.status !== "CLOSED"));

export const createUser = (formData) =>
  api.post(`/api/users`, formData);

export const updateUser = (userId, formData) =>
  api.put(`/api/users/${userId}`, formData);

export const toggleUserActive = (userId) =>
  api.patch(`/api/users/${userId}/active`);

export const deactivateUser = (userId, reassignEmail) => 
  api.patch(`/api/users/${userId}/active`, null, { params: { reassignEmail } });

export const userService = {
  getAllUsers,
  getUserById,
  getUserActiveTickets,
  createUser,
  getAllAdmins,
  updateUser,
  toggleUserActive,
  deactivateUser,
}
