import { api } from "./api";

export const createTicket = (ticketData, userId) =>
  api.post(`/api/tickets?userId=${userId}`, ticketData);

export const getMyTickets = () =>
  api.get(`/api/tickets/my-tickets`).then(res => res.data);

export const getAssignedTickets = () =>
  api.get(`/api/tickets/assigned`).then(res => res.data);

export const getAllTickets = () =>
  api.get("/api/tickets").then(res => res.data);

export const closeTicket = (ticketId, closingMessage = null) => {
  const params = closingMessage ? `?closingMessage=${encodeURIComponent(closingMessage)}` : '';
  return api.put(`/api/tickets/${ticketId}/close${params}`);
};

export const changePriority = (ticketId, priority) =>
  api.put(`/api/tickets/${ticketId}/priority?priority=${priority}`);

export const assignAdmin = (ticketId, adminId) =>
  api.put(`/api/tickets/${ticketId}/assign-admin?adminId=${adminId}`);

export const assignLabel = (ticketId, labelId) =>
  api.post(`/api/tickets/${ticketId}/labels/${labelId}`);

export const removeLabel = (ticketId, labelId) =>
  api.delete(`/api/tickets/${ticketId}/labels/${labelId}`);

export const getAllLabels = async () => {
  const response = await api.get("/api/labels");
  return response.data;
};

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
};