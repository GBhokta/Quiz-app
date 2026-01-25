import api from "./axios";

export function createQuestion(payload) {
  return api.post("/questions/", payload);
}

export function getQuestionsByTest(testId) {
  return api.get(`/questions/?test_id=${testId}`);
}
