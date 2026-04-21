import { api } from "./api";

export const getAllUsers = () =>
  api.get("/api/users").then(res => res.data);

export const getAllAdmins = () =>
  api.get("/api/users/admins").then(res => res.data);

export const getUserById = (userId) =>
  api.get(`/api/users/${userId}`).then(res => res.data);

export const deleteUser = (userId, reassignEmail) =>
  api.delete(`/api/users/${userId}?reassignEmail=${reassignEmail}`);

export const getUserActiveTickets = (userId) =>
  api.get(`/api/tickets/my-tickets?userId=${userId}`)
     .then(res => res.data.filter(t => t.status !== "CLOSED"));

export const userService = {
  getAllUsers,
  getAllAdmins,
  getUserById,
  deleteUser,
  getUserActiveTickets,
};
