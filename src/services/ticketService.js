import { api } from "./api";

export const createTicket = (ticketData, userId) =>
  api.post(`/api/tickets?userId=${userId}`, ticketData);

export const getMyTickets = (page = 0, size = 50) =>
  api.get(`/api/tickets/my-tickets?page=${page}&size=${size}`).then(res => res.data.content);

export const getAssignedTickets = (page = 0, size = 50) =>
  api.get(`/api/tickets/assigned?page=${page}&size=${size}`).then(res => res.data.content);

export const getAllTickets = (page = 0, size = 50) =>
  api.get(`/api/tickets?page=${page}&size=${size}`).then(res => res.data.content);

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

export const getAllLabels = (page = 0, size = 100) =>
  api.get(`/api/labels?page=${page}&size=${size}`).then(res => res.data.content);

export const getTicketById = async (ticketId) => {
  const response = await api.get(`/api/tickets/${ticketId}/detail`);
  return response.data;
};


/** Objeto agrupado para compatibilidad con imports { ticketService } */
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
  getAllLabels,
  getTicketById,
  reopenTicket,
  changeStatus
};
