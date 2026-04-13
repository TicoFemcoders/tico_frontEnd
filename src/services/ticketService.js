import { api } from "./api";

export const createTicket = (ticketData, userId) =>
  api.post(`/api/tickets?userId=${userId}`, ticketData);

export const getMyTickets = (userId) =>
  api.get(`/api/tickets/my-tickets?userId=${userId}`);

export const getAllTickets = () =>
  api.get("/api/tickets");

export const closeTicket = (ticketId) =>
  api.put(`/api/tickets/${ticketId}/close`);

export const changePriority = (ticketId, priority) =>
  api.put(`/api/tickets/${ticketId}/priority?priority=${priority}`);

export const assignAdmin = (ticketId, adminId) =>
  api.put(`/api/tickets/${ticketId}/assign-admin?adminId=${adminId}`);

export const assignLabel = (ticketId, labelId) =>
  api.post(`/api/tickets/${ticketId}/labels/${labelId}`);

export const removeLabel = (ticketId, labelId) =>
  api.delete(`/api/tickets/${ticketId}/labels/${labelId}`);