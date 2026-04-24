import { api } from "./api";

export const createTicket = (ticketData) =>
  api.post(`/api/tickets`, ticketData);

export const getMyTickets = (page = 0, size = 50) =>
  api.get(`/api/tickets/my-tickets`,{ params: { page, size } }).then(res => res.data.content);

export const getAssignedTickets = (page = 0, size = 50) =>
  api.get(`/api/tickets/assigned`,  { params: { page, size }}).then(res => res.data.content);

export const getAllTickets = (page = 0, size = 50) =>
  api.get(`/api/tickets`, { params: { page, size } }).then(res => res.data.content);

export const closeTicket = (ticketId, closingMessage = "") =>
  api.patch(`/api/tickets/${ticketId}/close`, { closingMessage });

export const reopenTicket = (ticketId) =>
  api.patch(`/api/tickets/${ticketId}/reopen`);

export const changeStatus = (ticketId, status) =>
  api.patch(`/api/tickets/${ticketId}/status`, { status });

export const changePriority = (ticketId, priority) =>
  api.patch(`/api/tickets/${ticketId}/priority`, { priority });

export const assignAdmin = (ticketId, adminId) =>
  api.patch(`/api/tickets/${ticketId}/assign-admin`, { adminId });

export const assignLabel = (ticketId, labelId) =>
  api.post(`/api/tickets/${ticketId}/labels/${labelId}`);

export const removeLabel = (ticketId, labelId) =>
  api.delete(`/api/tickets/${ticketId}/labels/${labelId}`);

export const getTicketById = async (ticketId) => {
  const response = await api.get(`/api/tickets/${ticketId}/detail`);
  return response.data;
};

export const ticketService = {
  createTicket,
  getMyTickets,
  getAllTickets,
  getAssignedTickets,
  closeTicket,
  changePriority,
  assignAdmin,
  assignLabel,
  removeLabel,
  getTicketById,
  reopenTicket,
  changeStatus
};
