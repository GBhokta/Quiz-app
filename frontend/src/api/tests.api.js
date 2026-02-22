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

export function getTestById(testId) {
  return api.get(`/tests/${testId}/`);
}

export function getTestQuestions(testId) {
  return api.get(`/tests/${testId}/questions/`);
}

export function addQuestionToTest(testId, payload) {
  return api.post(`/tests/${testId}/questions/`, payload);
}

export function removeQuestionFromTest(testId, questionId) {
  return api.delete(`/tests/${testId}/questions/${questionId}/`);
}
export function updateTest(testId, payload) {
  return api.put(`/tests/${testId}/`, payload);
}
export function addQuestionsToTest(testId, questions) {
  return api.post(`/tests/${testId}/questions/`, {
    questions: questions,
  });
}

export function getPasscode(testId) {
  return api.get(`/tests/${testId}/passcode/`);
}


export function publishTest(testId) {
  return api.post(`/tests/${testId}/publish/`);
}