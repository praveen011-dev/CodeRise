import { create } from "zustand";
import {
  fetchAllSubmissions,
  fetchSubmissionsForProblem,
  fetchSubmissionCountForProblem,
} from "../services/submissionService";
import { toast } from "sonner";

export const useSubmissionStore = create((set) => ({
  submissions: [],
  submissionCount: null,
  isLoading: false,
  error: null,

  // Action to get all submissions (consider if this is user-specific or admin)
  getAllSubmissions: async () => {
    set({ isLoading: true, error: null });
    try {
      const subsData = await fetchAllSubmissions();
      set({ submissions: subsData || [], isLoading: false });
      toast.success("Submissions loaded!"); // Maybe too noisy for a list
    } catch (error) {
      console.error("Error getting all submissions:", error);
      toast.error("Failed to load submissions", { description: error.message });
      set({ isLoading: false, error: error.message });
    }
  },

  // Action to get submissions for a specific problem
  getSubmissionForProblem: async (problemId) => {
    set({ isLoading: true, error: null, submissions: [] }); // Clear previous problem's submissions
    try {
      const subsData = await fetchSubmissionsForProblem(problemId);

      set({ submissions: subsData || [], isLoading: false });
    } catch (error) {
      console.error("Error getting submissions for problem:", error);
      toast.error("Failed to load submissions for this problem", {
        description: error.message,
      });
      set({ isLoading: false, error: error.message });
    }
  },

  // Action to get submission count for a problem
  getSubmissionCountForProblem: async (problemId) => {
    set({ isLoading: true, error: null });

    try {
      const countData = await fetchSubmissionCountForProblem(problemId);
      console.log(`SUBMISSION STORE: Received countData:`, countData);
      set({
        submissionCount: countData !== undefined ? countData : null,
      });
    } catch (error) {
      console.error("Error getting submission count:", error);

      set({ error: error.message }); 
    }
    // finally {
    //   set({ isLoading: false });
    // }
  },
}));
