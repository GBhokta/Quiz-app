import api from "./axios";

export function getMyResults() {
  return api.get("/results/my/");
}
