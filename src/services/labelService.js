import { api } from "./api";

export const getAllLabels = (page = 0, size = 100) =>
  api.get(`/api/labels`, { params: { page, size } }).then(res => res.data.content);


export const createLabel = (labelData) =>
  api.post("/api/labels", labelData).then(res => res.data);


export const updateLabel = (id, labelData) =>
  api.put(`/api/labels/${id}`, labelData).then(res => res.data);


export const deactivateLabel = (id) =>
  api.patch(`/api/labels/${id}/deactivate`);

export const activateLabel = (id) =>
  api.patch(`/api/labels/${id}/activate`).then(res => res.data);

export const searchLabels = (name) =>
  api.get(`/api/labels/filter`,{ params: { name, size: 100 } }).then(res => res.data.content);
 

export const labelService = {
  getAllLabels,
  createLabel,
  updateLabel,
  deactivateLabel,
  searchLabels,
  activateLabel
};