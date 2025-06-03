import { create } from "zustand";
import { executeUserCode } from "../services/executionService";
import { toast } from "sonner";

export const useExecutionStore = create((set) => ({
  executingAction: null, // <--- NEW STATE: null, 'run', or 'submit'
  submission: null, // Stores submission result (from your backend's ApiResponse data)
  error: null, // Stores any execution error

  // Action specifically for "Run Code"

  runUserCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId
  ) => {
    set({ executingAction: "run", submission: null, error: null });
    try {
      const payload = {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
      };
      const resultData = await executeUserCode(payload); // Calls your existing service

      set({ submission: resultData, executingAction: null });
      toast.info("Code Executed!", { description: "Check results below." });
      return resultData;
    } catch (apiError) {
      console.error("Error running code:", apiError);
      toast.error("Run Code Failed", { description: apiError.message });
      set({ executingAction: null, error: apiError.message, submission: null });
      throw apiError;
    }
  },

  // Action specifically for "Submit Solution"
  submitUserSolution: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId
  ) => {
    set({ executingAction: "submit", submission: null, error: null });
    try {
      const payload = {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
      };
      const submissionResult = await executeUserCode(payload); // Calls your existing service

      set({ submission: submissionResult, executingAction: null });
      toast.success("Solution Submitted!", {
        description: `Status: ${
          submissionResult.status || "Processing complete."
        }`,
      });
      return submissionResult;
    } catch (apiError) {
      console.error("Error submitting solution:", apiError);
      toast.error("Submission Failed", { description: apiError.message });
      set({ executingAction: null, error: apiError.message, submission: null });
      throw apiError;
    }
  },

  // Action to clear the execution state (results, errors)
  clearExecutionState: () => {
    set({ submission: null, error: null, executingAction: null }); // Also clear executingAction
  },
}));
