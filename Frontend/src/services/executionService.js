import apiClient from "../lib/apiClient";

export const executeUserCode = async (payload) => {
  // backend endpoint for code execution (e.g., /api/v1/execute-code)
  return apiClient("/execute-code", "POST", payload);
};
