import { it, expect } from "vitest";

it("jsdom funciona", () => {
  expect(typeof window).toBe("object");
  expect(typeof localStorage).toBe("object");
  localStorage.setItem("test", "ok");
  expect(localStorage.getItem("test")).toBe("ok");
});
