const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginUser = async (credentials) => {
  const loginEndpoint = `${API_BASE_URL}/login`;

  try {
    const response = await fetch(loginEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `Login failed. Status: ${response.status}`
      );
    }
    return data.data; // This should be the user object
  } catch (error) {
    console.error("Error in loginUser service:", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  const registerEndpoint = `${API_BASE_URL}/register`;

  try {
    const response = await fetch(registerEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `Registration failed. Status: ${response.status}`
      );
    }

    return data.data;
  } catch (error) {
    console.error("Error in registerUser service:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  const logoutEndpoint = `${API_BASE_URL}/logout`;

  try {
    const response = await fetch(logoutEndpoint, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `Logout failed. Status: ${response.status}`
      );
    }
    return data; // Or data.message
  } catch (error) {
    console.error("Error in logoutUser service:", error);
    throw error;
  }
};
