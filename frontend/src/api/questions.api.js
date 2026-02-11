import api from "./axios";

export function createQuestion(payload) {
  return api.post("/questions/create/", payload);
}

export function getQuestionsByTest(testId) {
  return api.get(`/questions/?test_id=${testId}`);
}
export function getQuestionsByTopic(topicId) {
  return api.get(`/questions/?topic_id=${topicId}`);
}

export function getAllQuestions() {
  return api.get("/questions/all/");
}

export function getMyQuestions() {
  return api.get("/questions/?scope=my");
}

export function getPublicQuestions() {
  return api.get("/questions/?scope=public");
}