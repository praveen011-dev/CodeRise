import apiClient from "../lib/apiClient";

const PROBLEM_RESOURCE_PATH = "/problems";

// Base path for user-related resources (where solved problems live)
// This should align with how your user.routes.js is mounted in your main app.
// For example, if user.routes.js is mounted under /api/v1/users, then this should be "/users".
const USER_RESOURCE_PATH = "/users";

export const fetchAllProblems = async () => {
  return apiClient(PROBLEM_RESOURCE_PATH, "GET");
};

export const fetchProblemById = async (problemId) => {
  if (!problemId) throw new Error("Problem ID is required.");
  return apiClient(`${PROBLEM_RESOURCE_PATH}/${problemId}`, "GET");
};

export const createProblem = async (problemData) => {
  return apiClient("/problems", "POST", problemData);
};

export const fetchSolvedProblemsByUser = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to fetch solved problems.");
  }
  // This constructs the URL like /users/:userId/solved-problems
  return apiClient(`${USER_RESOURCE_PATH}/${userId}/solved-problems`, "GET");
};

export const updateProblem = async (problemId, problemData) => {
  if (!problemId) throw new Error("Problem ID is required to update.");
  // Assuming /api/v1/problems/:problemId PATCH endpoint
  return apiClient(
    `${PROBLEM_RESOURCE_PATH}/${problemId}`,
    "PATCH",
    problemData
  );
};

export const deleteProblem = async (problemId) => {
  if (!problemId) throw new Error("Problem ID is required to delete.");
  // Assuming /api/v1/problems/:problemId DELETE endpoint
  return apiClient(`${PROBLEM_RESOURCE_PATH}/${problemId}`, "DELETE");
};
