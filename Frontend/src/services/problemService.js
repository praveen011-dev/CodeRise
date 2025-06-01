import apiClient from "../lib/apiClient";

export const fetchAllProblems = async () => {
  const allProblemsPath = "/problems";
  return apiClient(allProblemsPath, "GET");
};

export const fetchProblemById = async (problemId) => {
  if (!problemId) throw new Error("Problem ID is required.");
  return apiClient(`/problems/${problemId}`, "GET");
};

export const createProblem = async (problemData) => {
  return apiClient("/problems", "POST", problemData);
};
