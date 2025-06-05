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
  return apiClient("/users/profile", "GET");
};

// Function to upload profile picture
export const updateProfilePictureService = async (formData) => {
  return apiClient("/users/profile/avatar", "POST", formData, {
    "Content-Type": null, // Tell apiClient NOT to set Content-Type
  });
};

// // NEW: Function to fetch solved problems count
// export const fetchUserSolvedProblemsCount = async (userId) => {
//   // You'll need a backend route for this (e.g., /users/:userId/solved-problems-count)
//   return apiClient(`/users/${userId}/solved-problems-count`, "GET");
// };

// // NEW: Function to fetch user contributions for heatmap
// export const fetchUserContributions = async (userId) => {
//   // You'll need a backend route for this (e.g., /users/:userId/contributions)
//   return apiClient(`/users/${userId}/contributions`, "GET");
// };

// // Add placeholder service functions if you want to display counts for submissions and playlists
// export const fetchUserSubmissionsCount = async (userId) => {
//   // Implement backend route first if not already existing
//   return apiClient(`/users/${userId}/submissions/count`, "GET");
// };

// export const fetchUserPlaylistsCount = async (userId) => {
//   // Implement backend route first if not already existing
//   return apiClient(`/users/${userId}/playlists/count`, "GET");
// };
