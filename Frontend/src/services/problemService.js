import apiClient from "../lib/apiClient";

const RESOURCE_PATH = "/problems";

export const fetchAllProblems = async () => {
  return apiClient(RESOURCE_PATH, "GET");
};

export const fetchProblemById = async (problemId) => {
  if (!problemId) throw new Error("Problem ID is required.");
  return apiClient(`${RESOURCE_PATH}/${problemId}`, "GET");
};

export const createProblem = async (problemData) => {
  return apiClient("/problems", "POST", problemData);
};

export const fetchSolvedProblemsByUser = async () => {
  return apiClient(`${RESOURCE_PATH}/get-solved-problem`, "GET");
};
