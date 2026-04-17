import { api } from "./api";

export const getAllLabels = () =>
  api.get("/api/labels").then(res => res.data);


export const createLabel = (labelData) =>
  api.post("/api/labels", labelData).then(res => res.data);


export const updateLabel = (id, labelData) =>
  api.put(`/api/labels/${id}`, labelData).then(res => res.data);


export const deactivateLabel = (id) =>
  api.patch(`/api/labels/${id}/deactivate`);


export const searchLabels = (name) =>
  api.get(`/api/labels/filter?name=${name}`).then(res => res.data);

export const labelService = {
  getAllLabels,
  createLabel,
  updateLabel,
  deactivateLabel,
  searchLabels
};