import { create } from "zustand";
import { executeUserCode } from "../services/executionService"; // Ensure this service calls your backend API
import { toast } from "sonner";

export const useExecutionStore = create((set) => ({
  executingAction: null,
  submission: null, // This will hold the result from run or submit
  error: null,

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
        isSubmit: false, // Explicitly set to false for 'Run Code'
      };
      const resultData = await executeUserCode(payload);
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
        isSubmit: true, // Explicitly set to true for 'Submit Solution'
      };
      const submissionResult = await executeUserCode(payload);
      set({ submission: submissionResult, executingAction: null });
      toast.success("Solution Submitted!", {
        description: `Status: ${
          submissionResult?.status || "Processing complete."
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

  clearExecutionState: () => {
    set({ submission: null, error: null, executingAction: null });
  },
}));
