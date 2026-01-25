import api from "./axios";

export function getMyTests() {
  return api.get("/tests/my/");
}

export function createTest(payload) {
  return api.post("/tests/", payload);
}
export function updatePasscode(testId, payload) {
  return api.put(`/tests/${testId}/passcode/`, payload);
}
