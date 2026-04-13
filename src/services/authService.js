import { api } from "./api";

export const login = (credentials) =>
  api.post("/login", credentials);

export const activateAccount = (data) =>
  api.post("/api/activation/activate", data);

export const resendActivationCode = (email) =>
  api.post("/api/activation/resend", { email });

export const requestPasswordReset = (email) =>
  api.post("/api/reset-password/request", { email });

export const confirmPasswordReset = (data) =>
  api.post("/api/reset-password/confirm", data);

export const resendResetCode = (email) =>
  api.post("/api/reset-password/resend", { email });

