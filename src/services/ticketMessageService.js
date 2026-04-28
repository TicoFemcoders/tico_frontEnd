import { api } from "./api";

export const getMessagesByTicketId = (ticketId, page = 0, size = 20) =>
            api.get(`/api/tickets/${ticketId}/messages`, { params: { page, size } })
      .then(res => res.data.content ?? res.data ?? []);

export const createMessage = (ticketId, messageData) =>
  api.post(`/api/tickets/${ticketId}/messages`, messageData).then(res => res.data);

export const deleteMessage = (ticketId, messageId) =>
  api.delete(`/api/tickets/${ticketId}/messages/${messageId}`).then(res => res.data);

export const ticketMessageService = {
  getMessagesByTicketId,
  createMessage,
  deleteMessage,
};