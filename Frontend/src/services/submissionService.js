import apiClient from "../lib/apiClient";

const RESOURCE_PATH = "/submissions";

// Fetches all submissions (likely for a user or admin - backend needs to handle filtering)
export const fetchAllSubmissions = async () => {
  // Your backend GET route (e.g., /api/v1/submissions/get-all-submissions)
  return apiClient(`${RESOURCE_PATH}/get-submissions`, "GET");
};

// Fetches submissions for a specific problem (likely for the current user)
export const fetchSubmissionsForProblem = async (problemId) => {
  if (!problemId) throw new Error("Problem ID is required.");
  // Your backend GET route (e.g., /api/v1/submissions/get-submissions/:problemId)
  return apiClient(`${RESOURCE_PATH}/get-submissions/${problemId}`, "GET");
};

// Fetches submission count for a problem
export const fetchSubmissionCountForProblem = async (problemId) => {
  if (!problemId) throw new Error("Problem ID is required.");
  return apiClient(
    `${RESOURCE_PATH}/get-submissions-count/${problemId}`,
    "GET"
  );
};
