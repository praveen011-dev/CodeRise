import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { fetchProblemById } from "../../../services/problemService";
import { submitSolution } from "../../../services/executionService";
import { Button } from "@/components/ui/button";

// This map helps convert language names (from your backend/UI) to Judge0 language IDs
const languageNameToIdMap = {
  JAVASCRIPT: 63,
  PYTHON: 71,
  JAVA: 62,
};

// This map helps convert language names to what the Monaco Editor expects
const languageToMonacoEditorKey = {
  JAVASCRIPT: "javascript",
  PYTHON: "python",
  JAVA: "java",
};

function ProblemDetailPage() {
  //state for detail problem details
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the code editor
  const [userCode, setUserCode] = useState("");
  const [selectedLanguageKey, setSelectedLanguageKey] = useState("JAVASCRIPT");

  // State for code submission
  const [isSubmitting, setIsSubmitting] = useState(false); // True while code is being submitted/executed
  const [submissionResult, setSubmissionResult] = useState(null); // Stores the result from the backend
  const [submissionError, setSubmissionError] = useState(null); // Stores any error during submission

  useEffect(() => {
    const loadProblemDetails = async () => {
      if (!problemId) return; // Should not happen if route is set up correctly

      setLoading(true);
      setError(null);
      try {
        const fetchedProblem = await fetchProblemById(problemId);
        setProblem(fetchedProblem);
        // Set initial code snippet and language based on the fetched problem
        if (fetchedProblem?.codeSnippet) {
          const defaultLangKey =
            Object.keys(fetchedProblem.codeSnippet)[0] || "JAVASCRIPT";
          setSelectedLanguageKey(defaultLangKey);
          setUserCode(fetchedProblem.codeSnippet[defaultLangKey] || "");
        } else {
          setUserCode(""); // No snippets, start with empty editor
        }
      } catch (err) {
        console.error("Failed to load problem details:", err);
        setError(err.message || "Failed to load problem details.");
        setProblem(null);
      } finally {
        setLoading(false);
      }
    };

    loadProblemDetails();
  }, [problemId]); // Re-fetch if problemId changes

  // Effect 2: Update editor content if selected language changes AND problem data is available

  useEffect(() => {
    if (problem?.codeSnippet && problem.codeSnippet[selectedLanguageKey]) {
      setUserCode(problem.codeSnippet[selectedLanguageKey]);
    }
  }, [selectedLanguageKey, problem]); // Re-run if selected language or problem data changes

  // --- Section 3: Handler Functions ---

  // Called when the content of the code editor changes
  function handleEditorChange(value) {
    setUserCode(value || ""); // Update our state with the new code
  }

  // Called when the "Submit Solution" button is clicked
  const handleSubmitCode = async () => {
    if (!problem || !problem.testcases || problem.testcases.length === 0) {
      setSubmissionError(
        "Problem data or sample test cases are not loaded properly."
      );
      return;
    }

    setIsSubmitting(true); // Set loading state for submission
    setSubmissionResult(null); // Clear previous results
    setSubmissionError(null); // Clear previous errors

    const languageId = languageNameToIdMap[selectedLanguageKey]; // Convert "JAVASCRIPT" to 63
    if (!languageId) {
      setSubmissionError(
        `Language ID not found for ${selectedLanguageKey}. Please select a valid language.`
      );
      setIsSubmitting(false);
      return;
    }

    // Prepare the data to send to the backend
    const stdinArray = problem.testcases.map((tc) => tc.input);
    const expectedOutputsArray = problem.testcases.map((tc) => tc.output);

    const payload = {
      source_code: userCode,
      language_id: languageId,
      stdin: stdinArray,
      expected_outputs: expectedOutputsArray,
      problemId: problemId,
    };

    try {
      const result = await submitSolution(payload); // Call your service function
      setSubmissionResult(result); // Store the detailed result from backend
    } catch (error) {
      setSubmissionError(
        error.message || "An error occurred during submission."
      );
    } finally {
      setIsSubmitting(false); // Submission process finished
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center">
        Loading problem...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="container mx-auto p-8 text-center">
        Problem not found.
      </div>
    );
  }

  // Main JSX for the Problem Detail Page
  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Problem Information Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-3 text-slate-800">
          {problem.title}
        </h1>
        <div className="mb-3">
          <span
            className={`font-medium px-2.5 py-1 rounded-full text-xs ${
              problem.difficulty === "EASY"
                ? "bg-green-100 text-green-700"
                : problem.difficulty === "MEDIUM"
                ? "bg-yellow-100 text-yellow-700"
                : problem.difficulty === "HARD"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {problem.difficulty}
          </span>
        </div>

        {problem.description && (
          <div className="prose prose-slate max-w-none mb-5">
            <h2 className="text-xl font-semibold mb-2 text-slate-700">
              Description
            </h2>
            {/* If using react-markdown: <ReactMarkdown>{problem.description}</ReactMarkdown> */}
            {/* For plain text that might have newlines, use whitespace-pre-wrap */}
            <p className="whitespace-pre-wrap">{problem.description}</p>
          </div>
        )}

        {problem.examples && Object.keys(problem.examples).length > 0 && (
          <div className="mb-5">
            <h3 className="text-lg font-semibold mb-2 text-slate-700">
              Examples
            </h3>
            {/* Display example for the currently selected language or a default */}
            {problem.examples[selectedLanguageKey] ? (
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-sm">
                <p>
                  <strong>Input:</strong>{" "}
                  <pre className="inline whitespace-pre-wrap">
                    {problem.examples[selectedLanguageKey].input}
                  </pre>
                </p>
                <p>
                  <strong>Output:</strong>{" "}
                  <pre className="inline whitespace-pre-wrap">
                    {problem.examples[selectedLanguageKey].output}
                  </pre>
                </p>
                {problem.examples[selectedLanguageKey].explanation && (
                  <p className="mt-1">
                    <strong>Explanation:</strong>{" "}
                    {problem.examples[selectedLanguageKey].explanation}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No example available for the selected language.
              </p>
            )}
          </div>
        )}

        {problem.constraints && (
          <div className="mb-5">
            <h3 className="text-lg font-semibold mb-2 text-slate-700">
              Constraints
            </h3>
            <p className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap">
              {problem.constraints}
            </p>
          </div>
        )}
      </div>

      {/* Coding Workspace and Results Section (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Code Editor and Actions */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-slate-700">
              Your Solution
            </h3>
            <select
              value={selectedLanguageKey}
              onChange={(e) => setSelectedLanguageKey(e.target.value)}
              className="p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              disabled={isSubmitting}
            >
              {problem.codeSnippet &&
                Object.keys(problem.codeSnippet).map((langKey) => (
                  <option key={langKey} value={langKey}>
                    {langKey.charAt(0) + langKey.slice(1).toLowerCase()}
                  </option>
                ))}
            </select>
          </div>
          <div className="border border-slate-300 rounded-md overflow-hidden min-h-[400px] h-[50vh]">
            {" "}
            {/* Editor takes available space */}
            <Editor
              height="100%" // Use percentage for responsive height within parent
              language={
                languageToMonacoEditorKey[selectedLanguageKey] || "plaintext"
              }
              theme="vs-dark"
              value={userCode}
              onChange={handleEditorChange}
              options={{
                selectOnLineNumbers: true,
                minimap: { enabled: false },
                automaticLayout: true,
              }}
            />
          </div>
          <div className="flex space-x-3">
            {/* "Run Code" button can be added here later */}
            <Button
              onClick={handleSubmitCode}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 flex-grow"
            >
              {isSubmitting ? "Submitting..." : "Submit Solution"}
            </Button>
          </div>
        </div>

        {/* Right Column: Sample Test Cases and Submission Results */}
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              Sample Test Cases
            </h3>
            {problem.testcases?.length > 0 ? (
              problem.testcases.map((tc, index) => (
                <div
                  key={index}
                  className="mb-2 p-3 bg-slate-50 rounded border border-slate-200 text-sm"
                >
                  <p className="font-medium">Test Case {index + 1}:</p>
                  <p>
                    <strong>Input:</strong>{" "}
                    <pre className="inline whitespace-pre-wrap">{tc.input}</pre>
                  </p>
                  <p>
                    <strong>Expected Output:</strong>{" "}
                    <pre className="inline whitespace-pre-wrap">
                      {tc.output}
                    </pre>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No sample test cases provided.
              </p>
            )}
          </div>

          {/* Submission Results Area */}
          {(isSubmitting || submissionError || submissionResult) && ( // Only show this section if there's something to display
            <div className="border-t pt-4">
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                Submission Result
              </h3>
              {isSubmitting && (
                <p className="text-blue-600 animate-pulse">
                  Processing your submission...
                </p>
              )}
              {submissionError && (
                <p className="text-red-600 font-medium">
                  Error: {submissionError}
                </p>
              )}
              {submissionResult && (
                <div className="space-y-3 text-sm">
                  <h4
                    className={`text-lg font-semibold ${
                      submissionResult.status === "Accepted"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Overall Status: {submissionResult.status}
                  </h4>
                  {submissionResult.testcases?.map((tcResult, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded border ${
                        tcResult.passed
                          ? "bg-green-50 border-green-300"
                          : "bg-red-50 border-red-300"
                      }`}
                    >
                      <p className="font-medium">
                        Test Case {index + 1}:
                        <span
                          className={`ml-2 font-semibold ${
                            tcResult.passed ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {tcResult.passed
                            ? "Passed"
                            : tcResult.status || "Failed"}
                        </span>
                      </p>
                      {/* Input is from problem.testcases, not typically in tcResult if backend doesn't send it back */}
                      {/* <p><strong>Input:</strong> <pre className="inline whitespace-pre-wrap">{problem.testcases[index]?.input}</pre></p> */}
                      <p>
                        Your Output:{" "}
                        <pre className="inline whitespace-pre-wrap">
                          {tcResult.stdout !== null &&
                          tcResult.stdout !== undefined
                            ? tcResult.stdout
                            : "N/A"}
                        </pre>
                      </p>
                      <p>
                        Expected:{" "}
                        <pre className="inline whitespace-pre-wrap">
                          {tcResult.expectedOutput !== null &&
                          tcResult.expectedOutput !== undefined
                            ? tcResult.expectedOutput
                            : "N/A"}
                        </pre>
                      </p>
                      {tcResult.time && (
                        <p className="text-xs text-slate-500">
                          Time: {tcResult.time}
                        </p>
                      )}
                      {tcResult.memory && (
                        <p className="text-xs text-slate-500">
                          Memory: {tcResult.memory}
                        </p>
                      )}
                      {tcResult.compileOutput && (
                        <div className="mt-1">
                          <p className="text-xs font-semibold text-orange-600">
                            Compile Output:
                          </p>
                          <pre className="text-xs bg-orange-50 p-1 rounded whitespace-pre-wrap">
                            {tcResult.compileOutput}
                          </pre>
                        </div>
                      )}
                      {tcResult.stderr && (
                        <div className="mt-1">
                          <p className="text-xs font-semibold text-red-600">
                            Runtime Error (stderr):
                          </p>
                          <pre className="text-xs bg-red-50 p-1 rounded whitespace-pre-wrap">
                            {tcResult.stderr}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProblemDetailPage;
