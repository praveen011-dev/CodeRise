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

// NEW: Service functions for profile stats counts
export const fetchUserSolvedProblemsCount = async (userId) => {
  return apiClient(`/users/${userId}/solved-problems-count`, "GET");
};

export const fetchUserSubmissionsCount = async (userId) => {
  return apiClient(`/users/${userId}/submissions/count`, "GET");
};

export const fetchUserPlaylistsCount = async (userId) => {
  return apiClient(`/users/${userId}/playlists/count`, "GET");
};

export const fetchUserContributions = async (userId) => {
  return apiClient(`/users/${userId}/contributions`, "GET");
};

// NEW: Service functions to fetch detailed lists
export const fetchUserSubmissionsList = async (userId) => {
  // This expects the backend to return an object with total, accepted, wrongAnswer, and list
  return apiClient(`/users/${userId}/submissions`, "GET");
};

export const fetchUserSolvedProblemsList = async (userId) => {
  return apiClient(`/users/${userId}/solved-problems`, "GET");
};

export const fetchUserPlaylistsList = async (userId) => {
  return apiClient(`/users/${userId}/playlists`, "GET");
};
