export function isAuthenticated() {
  return Boolean(localStorage.getItem("access_token"));
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}
