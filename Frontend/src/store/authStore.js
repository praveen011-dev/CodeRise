import { create } from "zustand";

import {
  loginUser,
  logoutUser,
  registerUser,
  getCurrentUser,
  // updateProfilePictureService, // Will add this soon
} from "@/services/authService";

// Create the store
const useAuthStore = create((set) => ({
  //  Define the initial state of your store
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,

  // Define "actions" - functions that can change the state
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const userData = await loginUser(credentials); // This makes the API call

      set({
        user: userData,
        isLoggedIn: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user: userData };
    } catch (apiError) {
      const errorMessage =
        apiError.message || "Failed to login. Please try again.";
      set({
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const newRegisteredUserData = await registerUser(userData);

      set({
        user: newRegisteredUserData,
        isLoggedIn: true,
        isLoading: false,
        error: null,
      });

      console.log(
        "Signup and auto-login successful (from store):",
        newRegisteredUserData
      );
      return { success: true, user: newRegisteredUserData }; // Indicate success to the UI
    } catch (apiError) {
      const errorMessage =
        apiError.message || "Failed to register. Please try again.";
      set({
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await logoutUser();
      set({ user: null, isLoggedIn: false, isLoading: false, error: null });
      return { success: true };
    } catch (apiError) {
      const errorMessage =
        apiError.message || "Logout failed. Please try again.";
      set({
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  clearError: () => {
    set({ error: null });
  },

  checkAuthStatus: async () => {
    try {
      const userData = await getCurrentUser();
      set({ user: userData, isLoggedIn: true, isLoading: false, error: null });
    } catch (error) {
      set({ user: null, isLoggedIn: false, isLoading: false, error: null });
    }
  },

  updateUserProfile: (updatedFields) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedFields } : null,
    }));
  },
}));

export default useAuthStore;
