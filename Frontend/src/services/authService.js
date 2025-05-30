import apiClient from "../lib/apiClient.js";

// Login user: calls POST /users/login
export const loginUser = async (credentials) => {
  return apiClient("/users/login", "POST", credentials);
};

// Register user: calls POST /users/register
export const registerUser = async (userData) => {
  return apiClient("/users/register", "POST", userData);
};

// Logout user: calls POST /users/logout (ensure method is correct for your backend)
export const logoutUser = async () => {
  return apiClient("/users/logout", "POST"); // no body needed
};

// Get current user details: calls GET /users/profile
export const getCurrentUser = async () => {
  return apiClient("/users/profile", "GET"); // Or your specific 'me' endpoint
};
