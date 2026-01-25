import api from "./axios";

export function registerUser(payload) {
  return api.post("/auth/register/", payload);
}

export function loginUser(payload) {
  return api.post("/auth/login/", payload);
}
export function getProfile() {
  return api.get("/auth/profile/");
}
