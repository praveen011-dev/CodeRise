const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchAllProblems = async () => {
  // ADJUST this path to match your backend endpoint for all problems
  const allProblemsPath = "/problems"; // Or '/problems/get-problems'

  try {
    const response = await fetch(`${API_BASE_URL}${allProblemsPath}`, {
      credentials: "include", // Ensures browser sends cookies
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `HTTP error! Status: ${response.status}`
      );
    }
    const data = await response.json();
    // ADJUST 'data.data' if your API response structure is different
    return data.data || [];
  } catch (error) {
    console.error("Error in fetchAllProblems:", error);
    throw error;
  }
};

export const fetchProblemById = async (problemId) => {
  if (!problemId) {
    console.error("Error in fetchProblemById: problemId is required.");
    throw new Error("Problem ID is required.");
  }

  try {
    // Assumes backend route is '/problems/:id'
    const response = await fetch(`${API_BASE_URL}/problems/${problemId}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `HTTP error! Status: ${response.status}`
      );
    }
    const data = await response.json();
    // ADJUST 'data.data' if your API response structure is different
    return data.data;
  } catch (error) {
    console.error(`Error in fetchProblemById for ID ${problemId}:`, error);
    throw error;
  }
};
