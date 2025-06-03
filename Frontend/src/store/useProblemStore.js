import { create } from "zustand";
import {
  fetchAllProblems,
  fetchProblemById,
  fetchSolvedProblemsByUser,
} from "../services/problemService";
import { toast } from "sonner";

export const useProblemStore = create((set) => ({
  isProblemLoading: false,
  isProblemsLoading: false,
  problems: [],
  problem: null,
  solvedProblems: [],

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
      toast.success("Problem loaded!");
    } catch (error) {
      console.error("Error getting problem by ID:", error);
      toast.error("Failed to load problem", { description: error.message });
      set({ isProblemLoading: false, error: error.message });
    }
  },

  // Action to get problems solved by the user
  getSolvedProblemByUser: async () => {
    set({ isLoadingSolved: true, error: null });
    try {
      const solvedData = await fetchSolvedProblemsByUser(); // Uses service
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
}));
