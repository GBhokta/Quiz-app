import api from "./axios";

export function startSession(payload) {
  return api.post("/session/start/", payload);
}
export function submitSession(payload) {
  return api.post("/session/submit/", payload);
}
