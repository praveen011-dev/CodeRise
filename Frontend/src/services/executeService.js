const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const submitSolution = async (payload) => {
  // payload = { source_code, language_id, stdin, expected_outputs, problemId }
  const endpoint = `${API_BASE_URL}/execute-code`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization header will be needed if this route is protected
        // and if you're using Bearer tokens.
        // For HttpOnly cookies, 'credentials: include' handles it.
      },
      body: JSON.stringify(payload),
      credentials: "include", // Crucial for sending auth cookies
    });

    const data = await response.json();

    if (!response.ok) {
      // Use error message from backend if available (e.g., data.message or data.errors)
      throw new Error(
        data.message || `Code submission failed. Status: ${response.status}`
      );
    }

    // Backend returns ApiResponse(200, "code Executed", submissionWithTestcase)
    // So, data.data should contain submissionWithTestcase
    return data.data;
  } catch (error) {
    console.error("Error in submitSolution service:", error.message);
    throw error; // Re-throw to be handled by the component/store
  }
};
