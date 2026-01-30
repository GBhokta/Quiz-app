import api from "./axios";

export function validateAccess(payload) {
  return api.post("/access/validate/", payload);
}
