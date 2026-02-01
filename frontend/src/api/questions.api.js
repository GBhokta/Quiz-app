import api from "./axios";

export function createQuestion(payload) {
  return api.post("/questions/create/", payload);
}

export function getQuestionsByTest(testId) {
  return api.get(`/questions/?test_id=${testId}`);
}
