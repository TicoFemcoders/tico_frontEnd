import { api } from "./api";

export const getMessagesByTicketId = (ticketId) =>
  api.get(`/api/tickets/${ticketId}/messages`).then(res => res.data);

export const createMessage = (ticketId, messageData) =>
  api.post(`/api/tickets/${ticketId}/messages`, messageData).then(res => res.data);

export const deleteMessage = (ticketId, messageId) =>
  api.delete(`/api/tickets/${ticketId}/messages/${messageId}`).then(res => res.data);

export const ticketMessageService = {
  getMessagesByTicketId,
  createMessage,
  deleteMessage,
};