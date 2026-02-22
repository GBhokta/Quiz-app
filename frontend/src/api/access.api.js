import api from "./axios";


export const validateAccess = (data) => {
  return api.post("/access/validate/", data);   
};