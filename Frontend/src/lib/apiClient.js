const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function apiClient(
  endpoint,
  method = "GET",
  body = null,
  customHeaders = {}
) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Standard options for all fetch requests
  const options = {
    method,
    credentials: "include",
    headers: {
      ...customHeaders, // Allows adding specific headers if needed
    },
  };

  // If there's data to send (for POST, PUT, etc.), format it as JSON
  if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.json().catch(() => ({
      // Try to get JSON data from response
      message: `Server returned non-JSON response. Status: ${response.status}`,
    }));

    if (!response.ok) {
      throw new Error(
        responseData.message || `API request failed: ${response.status}`
      );
    }
    // Return the 'data' part of the backend's response (as per your ApiResponse)
    return responseData.data;
  } catch (error) {
    console.error(`API Client Error [${method} ${endpoint}]: ${error.message}`);
    throw error; // Pass the error up to be handled by the caller
  }
}

export default apiClient;
