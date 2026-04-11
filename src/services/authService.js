import { api } from "./api";

export const login = (credentials) =>
  api.post("/login", credentials);

export const activateAccount = (data) =>
  api.post("/api/activation/activate", data);

export const resendActivationCode = (email) =>
  api.post("/api/activation/resend", { email });