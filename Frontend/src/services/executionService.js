import apiClient from "../lib/apiClient";

export const executeUserCode = async (payload) => {
  return apiClient("/execute-code", "POST", payload);
};
