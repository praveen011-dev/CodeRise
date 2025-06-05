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
  if (body instanceof FormData) {
    options.body = body;
  }
  // If there's data to send (for POST, PUT, etc.), format it as JSON
  else if (
    body &&
    (method === "POST" || method === "PUT" || method === "PATCH")
  ) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  // Merge custom headers. This is where a `Content-Type: null` in customHeaders
  // can effectively remove the default 'application/json' for FormData.
  if (customHeaders) {
    for (const headerName in customHeaders) {
      if (customHeaders.hasOwnProperty(headerName)) {
        if (customHeaders[headerName] === null) {
          // If customHeader is null, explicitly delete it from options.headers
          delete options.headers[headerName];
        } else {
          options.headers[headerName] = customHeaders[headerName];
        }
      }
    }
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.json().catch(() => ({
      // If response is not JSON (e.g., empty 204 response or unexpected)
      message: `Server returned non-JSON response. Status: ${response.status}`,
    }));
    if (!response.ok) {
      throw new Error(
        responseData.message || `API request failed: ${response.status}`
      );
    }
    return responseData.data;
  } catch (error) {
    console.error(`API Client Error [${method} ${endpoint}]: ${error.message}`);
    // If it's an Error instance with a message, use it; otherwise, default
    throw new Error(
      error.message || `An unknown API client error occurred for ${endpoint}.`
    );
  }
}

export default apiClient;
