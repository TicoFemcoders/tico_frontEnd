import React, { useState, useCallback } from "react";
import { AuthContext } from "./authContext";
import { api } from "../services/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const login = useCallback((axiosResponse) => {
    const rawToken = axiosResponse.headers["authorization"]?.replace(/^Bearer\s+/i, "");
    const body = axiosResponse.data;
    const userData = {
      id: body.userId,
      name: body.name,
      email: body.email,
      roles: body.roles,
    };
    localStorage.setItem("token", rawToken);
    localStorage.setItem("user", JSON.stringify(userData));
    api.defaults.headers.common["Authorization"] = `Bearer ${rawToken}`;
    setToken(rawToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  }, []);

  const hasRole = useCallback((role) => user?.roles?.includes(`ROLE_${role}`) ?? false, [user]);

  return <AuthContext.Provider value={{ user, token, login, logout, hasRole }}>{children}</AuthContext.Provider>;
}
