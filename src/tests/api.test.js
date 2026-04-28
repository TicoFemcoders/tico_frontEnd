import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { api } from "../services/api.js";

describe("Interceptores Axios - api.js", () => {
  let reqFulfilled;
  let resFulfilled;
  let resRejected;

  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("location", { href: "" });

    reqFulfilled = api.interceptors.request.handlers[0].fulfilled;
    resFulfilled = api.interceptors.response.handlers[0].fulfilled;
    resRejected = api.interceptors.response.handlers[0].rejected;

    delete api.defaults.headers.common["Authorization"];
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("inyecta Authorization: Bearer <token> si hay token en localStorage", () => {
    localStorage.setItem("token", "mitoken123");
    const config = { headers: {} };
    const result = reqFulfilled(config);
    expect(result.headers.Authorization).toBe("Bearer mitoken123");
  });

  it("no añade Authorization si no hay token en localStorage", () => {
    const config = { headers: {} };
    const result = reqFulfilled(config);
    expect(result.headers.Authorization).toBeUndefined();
  });

  it("actualiza el token en localStorage si la respuesta trae nuevo header Authorization", () => {
    const response = { headers: { authorization: "Bearer nuevotoken456" } };
    resFulfilled(response);
    expect(localStorage.getItem("token")).toBe("nuevotoken456");
    expect(api.defaults.headers.common["Authorization"]).toBe("Bearer nuevotoken456");
  });

  it("no modifica el token si la respuesta no trae header Authorization", () => {
    localStorage.setItem("token", "tokenexistente");
    resFulfilled({ headers: {} });
    expect(localStorage.getItem("token")).toBe("tokenexistente");
  });

  it("error 401 limpia localStorage y redirige a /login", async () => {
    localStorage.setItem("token", "test");
    localStorage.setItem("user", JSON.stringify({ id: 1 }));

    const error = {
      response: { status: 401, data: {} },
      config: { url: "/tickets" },
    };

    await expect(resRejected(error)).rejects.toBeDefined();

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(window.location.href).toBe("/login");
  });

  it("error 401 en /login no redirige para evitar bucle", async () => {
    const error = {
      response: { status: 401, data: {} },
      config: { url: "/login" },
    };

    await expect(resRejected(error)).rejects.toBeDefined();
    expect(window.location.href).toBe("");
  });

  it("error 403 limpia localStorage y redirige a /login?roleChanged=1", async () => {
    localStorage.setItem("token", "test");
    localStorage.setItem("user", JSON.stringify({ id: 1 }));

    const error = {
      response: { status: 403, data: {} },
      config: { url: "/admin" },
    };

    await expect(resRejected(error)).rejects.toBeDefined();

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(window.location.href).toBe("/login?roleChanged=1");
  });

  it("ECONNABORTED asigna friendlyMessage de timeout", async () => {
    const error = { code: "ECONNABORTED", config: { url: "/test" } };

    try {
      await resRejected(error);
      expect.fail("Debería haber rechazado la promesa");
    } catch (e) {
      expect(e.friendlyMessage).toBe(
        "El servidor está tardando demasiado. Inténtelo de nuevo en unos segundos.",
      );
    }
  });
});
