import { create } from "zustand";
import {
  fetchAllProblems,
  fetchProblemById,
  fetchSolvedProblemsByUser,
  updateProblem as updateProblemService, // Alias to avoid naming conflict
  deleteProblem as deleteProblemService, // Alias
} from "../services/problemService";
import { toast } from "sonner";
import useAuthStore from "./authStore";

export const useProblemStore = create((set, get) => ({
  isProblemLoading: false,
  isProblemsLoading: false,
  problems: [],
  problem: null,
  solvedProblems: [],
  error: null,
  isLoadingSolved: false,

  // Action to get all problems
  getAllProblems: async () => {
    set({ isProblemsLoading: true, error: null });
    try {
      const problemData = await fetchAllProblems(); // Uses service
      set({ problems: problemData || [], isProblemsLoading: false });
    } catch (error) {
      console.error("Error getting all problems:", error);
      toast.error("Failed to load problems", { description: error.message });
      set({ isProblemsLoading: false, error: error.message });
    }
  },

  // Action to get a single problem by ID
  getProblemById: async (id) => {
    set({ isProblemLoading: true, error: null });
    try {
      const problemData = await fetchProblemById(id); // Uses service
      set({ problem: problemData, isProblemLoading: false });
      return problemData;
      // toast.success("Problem loaded!");
    } catch (error) {
      console.error("Error getting problem by ID:", error);
      toast.error("Failed to load problem", { description: error.message });
      set({ isProblemLoading: false, error: error.message });
    }
  },

  // Action to get problems solved by the user
  getSolvedProblemByUser: async () => {
    const authUser = useAuthStore.getState().user;

    // IMPORTANT: Check if authUser itself is null/undefined before accessing its properties
    if (!authUser || !authUser.id) {
      console.warn(
        "getSolvedProblemByUser: No authenticated user found or user ID is missing. Clearing solved problems."
      );
      set({ solvedProblems: [], isLoadingSolved: false });
      return;
    }
    set({ isLoadingSolved: true, error: null });
    try {
      const solvedData = await fetchSolvedProblemsByUser(authUser.id); // Uses service
      set({ solvedProblems: solvedData || [], isLoadingSolved: false });
    } catch (error) {
      console.error("Error getting solved problems:", error);
      toast.error("Failed to load solved problems", {
        description: error.message,
      });
      set({ isLoadingSolved: false, error: error.message });
    }
  },
  // Add an error state to the store if you want to display it beyond toasts
  error: null,
  isLoadingSolved: false, // Example specific loading state

  // --- NEW ACTIONS FOR ADMIN ---
  updateProblem: async (problemId, problemData) => {
    set({ isProblemsLoading: true, error: null }); // Use a loading state for all problems
    try {
      const updated = await updateProblemService(problemId, problemData);
      set((state) => ({
        problems: state.problems.map((p) =>
          p.id === updated.id ? updated : p
        ),
        isProblemsLoading: false,
      }));
      toast.success("Problem updated successfully!");
    } catch (error) {
      console.error("Error updating problem:", error);
      toast.error("Failed to update problem", { description: error.message });
      set({ isProblemsLoading: false, error: error.message });
      throw error;
    }
  },

  deleteProblem: async (problemId) => {
    set({ isProblemsLoading: true, error: null });
    try {
      await deleteProblemService(problemId);
      set((state) => ({
        problems: state.problems.filter((p) => p.id !== problemId),
        isProblemsLoading: false,
      }));
      toast.success("Problem deleted successfully!");

      get().getSolvedProblemByUser();
    } catch (error) {
      console.error("Error deleting problem:", error);
      toast.error("Failed to delete problem", { description: error.message });
      set({ isProblemsLoading: false, error: error.message });
      throw error; // Re-throw to allow component to handle if needed
    }
  },

  // NEW ACTION: Clear the currently loaded problem
  clearProblem: () => {
    set({ problem: null, error: null, isProblemLoading: false });
  },
}));
