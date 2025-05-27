import { create } from "zustand";
import {
  loginUser,
  logoutUser,
  registerUser,
  getCurrentUser,
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
      const newRegisteredUserData = await registerUser(userData); // This makes the API call

      // - If registration and auto-login by backend were successful:
      //    - The backend has set HttpOnly cookies.
      //    - 'newRegisteredUserData' contains the user details.
      //    - Update the store to reflect the new logged-in state.

      set({
        user: newRegisteredUserData, // Store the user data
        isLoggedIn: true, // Set isLoggedIn to true
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
        user: null, // Ensure user state is cleared/null on error
        isLoggedIn: false,
        isLoading: false,
        error: errorMessage, // Set the error message in the store
      });
      return { success: false, error: errorMessage };
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await logoutUser(); // Call backend to clear HttpOnly cookies
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
    set({ error: null }); // This action sets the 'error' state back to null
  },

  checkAuthStatus: async () => {
    // Don't set isLoading to true here unless you want a global app loader
    // as this runs on app load.
    // set({ isLoading: true });
    try {
      const userData = await getCurrentUser(); // Call the service
      set({ user: userData, isLoggedIn: true, isLoading: false, error: null });
    } catch (error) {
      // This is expected if the user is not logged in (no valid cookies)
      set({ user: null, isLoggedIn: false, isLoading: false, error: null });
    }
  },
}));

export default useAuthStore;
