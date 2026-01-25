import api from "./axios";

export function validateTestAccess(payload) {
  return api.post("/access/validate/", payload);
}
