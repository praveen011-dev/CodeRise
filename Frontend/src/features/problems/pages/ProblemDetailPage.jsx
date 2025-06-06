// --- Imports ---
import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom"; // For navigation and getting URL params
import Editor from "@monaco-editor/react"; // The code editor component

import SubmissionsList from "../../../features/submissions/components/SubmissionsList"; // Or your chosen path
import ExecutionResultDisplay from "../../../features/codeExecution/components/ExecutionResultDisplay"; //execution results

// Your Zustand stores - these manage global/shared state
import { useProblemStore } from "../../../store/useProblemStore"; // For fetching and storing current problem's details
import { useExecutionStore } from "../../../store/useExecutionStore"; // For managing current code execution (run/submit)
import { useSubmissionStore } from "../../../store/useSubmissionStore"; // For fetching past submission lists and counts

// Your utility function
import { getLanguageIdByName } from "../../../lib/languageUtils"; // Converts language name to ID for backend

// Shadcn/UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Lucide Icons
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Code2,
  Home,
  Terminal,
  Check,
  ChevronRight,
  Clock,
} from "lucide-react";

// Helper to map our language keys (e.g., "JAVASCRIPT") to Monaco Editor's language keys (e.g., "javascript")
const languageToMonacoKey = (langKey = "JAVASCRIPT") => {
  const map = {
    JAVASCRIPT: "javascript",
    PYTHON: "python",
    JAVA: "java",
  };
  return map[langKey.toUpperCase()] || "plaintext";
};

function ProblemDetailPage() {
  // --- Hooks and State Initialization ---
  const { problemId } = useParams();

  // Destructure state and actions from useProblemStore

  const {
    getProblemById,
    problem,
    isLoading: isProblemLoading,
    error: problemError,
    clearProblem,
  } = useProblemStore();

  // Destructure state and actions from useSubmissionStore

  const {
    submissions: pastSubmissions, // List of historical submissions for the "Submissions" tab
    isLoading: isPastSubmissionsLoading,
    getSubmissionForProblem, // Action to fetch past submissions
    getSubmissionCountForProblem, // Action to fetch the number of submissions
    submissionCount, // The count of submissions
  } = useSubmissionStore();

  // Destructure new actions from useExecutionStore
  const {
    runUserCode, // New action for running code
    submitUserSolution, // New action for submitting solution
    submission: currentExecutionResult,
    executingAction,
    error: executionError,
    clearExecutionState,
  } = useExecutionStore();

  // Local state specific to this ProblemDetailPage component

  const [userCode, setUserCode] = useState(""); // Stores the code typed by the user in the editor
  const [selectedLanguageKey, setSelectedLanguageKey] = useState("JAVASCRIPT"); // e.g., "JAVASCRIPT", "PYTHON"
  const [customInput, setCustomInput] = useState(""); // For the "Run Code" feature with custom input
  const [activeInfoTab, setActiveInfoTab] = useState("description"); // Which tab is active (Description, Submissions, etc.)

  // --- useEffect Hooks (for side effects like data fetching) ---
  // Effect 1: Fetch main problem details and submission count when the page loads or problemId changes

  useEffect(() => {
    if (problemId) {
      // 1. Clear current problem state immediately before fetching a new one

      // Only run if problemId is available
      clearProblem(); // <--- This call should happen immediately
      getProblemById(problemId); // Action from useProblemStore to fetch problem data
      getSubmissionCountForProblem(problemId); // Action from useSubmissionStore
      clearExecutionState?.(); // Action from useExecutionStore to clear old run/submit results
    }
    // 2. Cleanup function: Clear problem state when component unmounts
    return () => {
      console.log(
        "ProblemDetailPage: Component unmounting or problemId changing, clearing problem state in cleanup."
      );
      clearProblem();
      clearExecutionState?.();
    };
  }, [
    problemId,
    getProblemById,
    getSubmissionCountForProblem,
    clearExecutionState,
    clearProblem,
  ]);

  // Effect 2: Set initial code snippet in editor when 'problem' data is loaded or 'selectedLanguageKey' changes
  // *** MODIFIED LOGIC HERE FOR DEMO VS REGULAR PROBLEM CODE ***
  useEffect(() => {
    if (problem) {
      let codeToLoad = "";

      // Prioritize demoSolution if it's a demo problem and has code for the selected language
      if (
        problem.isDemo &&
        problem.demoSolution &&
        problem.demoSolution[selectedLanguageKey]
      ) {
        codeToLoad = problem.demoSolution[selectedLanguageKey];
      }
      // Otherwise, load the regular codeSnippet
      else if (
        problem.codeSnippet &&
        problem.codeSnippet[selectedLanguageKey]
      ) {
        codeToLoad = problem.codeSnippet[selectedLanguageKey];
      }
      // Fallback: If the selected language doesn't have a snippet, try the first available language
      else if (
        problem.codeSnippet &&
        Object.keys(problem.codeSnippet).length > 0
      ) {
        const firstAvailableLang = Object.keys(problem.codeSnippet)[0];
        if (selectedLanguageKey !== firstAvailableLang) {
          // If the current selected language has no snippet, but another one does,
          // change the selected language to load that snippet.
          setSelectedLanguageKey(firstAvailableLang);
          return; // Exit this effect
        } else {
          // If the first available language is already selected but its snippet is empty/undefined
          codeToLoad = problem.codeSnippet[firstAvailableLang] || "";
        }
      }

      setUserCode(codeToLoad);
    }
  }, [problem, selectedLanguageKey]); // Dependencies remain the same

  // Effect 3: Fetch past submissions if the "Submissions" tab is clicked

  useEffect(() => {
    if (activeInfoTab === "submissions" && problemId) {
      getSubmissionForProblem(problemId); // Action from useSubmissionStore
    }
  }, [activeInfoTab, problemId, getSubmissionForProblem]);

  // --- Handler Functions ---

  // When the user selects a different language from the dropdown
  const handleLanguageChange = (value) => {
    setSelectedLanguageKey(value);
  };

  // When the user types in the code editor
  const handleEditorChange = (value) => {
    setUserCode(value || ""); // Update the local state holding the code
  };

  //NEW FUNCTIONS: for login and run button.

  const handleRunCode = async () => {
    // Check if problem data (which includes sample testcases) is loaded
    if (!problem || !problem.testcases) {
      // Using sample test cases for "Run"
      useExecutionStore.setState({
        error: "Problem data or sample test cases not loaded for 'Run Code'.",
        executingAction: null,
      });
      return;
    }
    clearExecutionState?.();

    const languageId = getLanguageIdByName(selectedLanguageKey);
    if (!languageId) {
      useExecutionStore.setState({
        error: `Invalid language selected: ${selectedLanguageKey}`,
        executingAction: null,
      });
      return;
    }

    // For "Run Code", use customInput if provided, otherwise ALL sample test cases.
    // Your backend executeCode expects arrays for stdin and expected_outputs.
    let stdinArray, expectedOutputsArray;
    if (customInput.trim() !== "") {
      stdinArray = [customInput];
      // For custom input run, expected_output might be less relevant or not provided by user
      // The backend will return stdout, which is what the user wants to see.
      expectedOutputsArray = [""]; // Send a placeholder or what your backend expects for run
    } else {
      stdinArray = problem.testcases.map((tc) => tc.input);
      expectedOutputsArray = problem.testcases.map((tc) => tc.output);
    }

    if (stdinArray.length === 0 && customInput.trim() === "") {
      useExecutionStore.setState({
        error: "No input provided for 'Run Code'. Use samples or custom input.",
        executingAction: null,
      });
      return;
    }

    console.log("Running code with payload:", {
      userCode,
      languageId,
      stdinArray,
      expectedOutputsArray,
      problemId,
    });
    try {
      await runUserCode(
        // Call the new specific action
        userCode,
        languageId,
        stdinArray,
        expectedOutputsArray,
        problemId
      );
    } catch (error) {
      console.error("Run Code failed in component:", error);
    }
  };

  //handler for submit
  const handleSubmitSolution = async () => {
    if (!problem || !problem.testcases || problem.testcases.length === 0) {
      useExecutionStore.setState({
        error: "Problem data or sample test cases not loaded for submission.",
        executingAction: null,
      });
      return;
    }
    clearExecutionState?.();

    const languageId = getLanguageIdByName(selectedLanguageKey);
    if (!languageId) {
      useExecutionStore.setState({
        error: `Invalid language selected: ${selectedLanguageKey}`,
        executingAction: null,
      });
      return;
    }

    // For "Submit", use all defined sample test cases from the problem
    const stdinArray = problem.testcases.map((tc) => tc.input);
    const expectedOutputsArray = problem.testcases.map((tc) => tc.output);

    console.log("Submitting solution with payload:", {
      userCode,
      languageId,
      stdinArray,
      expectedOutputsArray,
      problemId,
    });
    try {
      const submissionData = await submitUserSolution(
        // Call the new specific action
        userCode,
        languageId,
        stdinArray,
        expectedOutputsArray,
        problemId
      );

      if (submissionData) {
        getSubmissionCountForProblem(problemId);
        if (activeInfoTab === "submissions") {
          getSubmissionForProblem(problemId);
        }
      }
    } catch (error) {
      // Error toast is likely handled by the executeCode action in the store.
      // No need to do much extra here unless specific UI changes are needed for this component on error.
      console.error("Submission failed (caught in component):", error);
    }
  };

  // --- Memoized Values ---

  // Get a list of available languages for the dropdown, based on problem.codeSnippet

  const availableLanguages = useMemo(
    () => (problem?.codeSnippet ? Object.keys(problem.codeSnippet) : []),
    [problem?.codeSnippet]
  );
  // --- Conditional Rendering for Loading/Error States for the Page ---

  if (isProblemLoading || (problem === null && problemId)) {
    // From useProblemStore
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <p className="text-lg">Loading problem...</p>
      </div>
    );
  }
  if (problemError) {
    // From useProblemStore
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] text-red-500">
        <p className="text-lg">Error: {problemError}</p>
      </div>
    );
  }
  if (!problem) {
    // From useProblemStore (if not loading and no error, but problem is still null)
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <p className="text-lg">Problem not found.</p>
      </div>
    );
  }

  // --- Main JSX Return (Renders the Page UI) ---

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      {/* Top Info Bar */}
      <div className="bg-white dark:bg-slate-800/50 shadow-sm sticky top-0 z-10 border-b dark:border-slate-700">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left side of top bar: Breadcrumbs / Title */}
          <div className="flex items-center gap-2 overflow-hidden">
            <Link
              to="/problems"
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 shrink-0"
            >
              <Home className="w-5 h-5" />
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0" />
            <h1
              className="text-md font-semibold truncate flex items-center gap-2"
              title={problem.title}
            >
              {problem.title}
              {problem.isDemo && ( // <--- DEMO BADGE ON DETAIL PAGE TOP BAR
                <Badge
                  variant="outline"
                  className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700 text-[0.6rem] px-1 py-0.5 ml-1"
                >
                  DEMO
                </Badge>
              )}
            </h1>
            {/* Difficulty Badge */}
            <span
              className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                problem.difficulty === "EASY"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : problem.difficulty === "MEDIUM"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  : problem.difficulty === "HARD"
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  : "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
              }`}
            >
              {problem.difficulty}
            </span>
          </div>
          {/* Right side of top bar: Language Selector */}
          <div className="flex items-center gap-2">
            <Select
              value={selectedLanguageKey}
              onValueChange={handleLanguageChange}
              disabled={executingAction !== null}
            >
              <SelectTrigger className="w-[130px] sm:w-[150px] h-9 text-xs sm:text-sm bg-white dark:bg-slate-800">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages.length > 0 ? (
                  availableLanguages.map((lang) => (
                    <SelectItem
                      key={lang}
                      value={lang}
                      className="text-xs sm:text-sm"
                    >
                      {lang.charAt(0).toUpperCase() +
                        lang.slice(1).toLowerCase()}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="disabled" disabled>
                    No languages
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Two Columns */}
      <div
        className="container mx-auto p-3 grid grid-cols-1 lg:grid-cols-2 gap-4"
        style={{ height: "calc(100vh - 3.5rem - 1.5rem)" }}
      >
        {/* Left Panel: Problem Information in Tabs */}
        <Card className="flex flex-col overflow-hidden">
          <Tabs
            value={activeInfoTab}
            onValueChange={setActiveInfoTab}
            className="w-full flex flex-col flex-grow"
          >
            {/* Tab Triggers (Buttons to switch tabs) */}
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 rounded-none border-b bg-slate-100 dark:bg-slate-800 shrink-0">
              <TabsTrigger
                value="description"
                className="text-xs p-2 sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
              >
                <FileText className="w-3.5 h-3.5 mr-1 sm:mr-2" />
                Description
              </TabsTrigger>
              <TabsTrigger
                value="submissions"
                className="text-xs p-2 sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
              >
                <Code2 className="w-3.5 h-3.5 mr-1 sm:mr-2" />
                Submissions ({submissionCount ?? 0})
              </TabsTrigger>
              <TabsTrigger
                value="discussion"
                className="text-xs p-2 sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
              >
                <MessageSquare className="w-3.5 h-3.5 mr-1 sm:mr-2" />
                Discuss
              </TabsTrigger>
              <TabsTrigger
                value="hints"
                className="text-xs p-2 sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
              >
                <Lightbulb className="w-3.5 h-3.5 mr-1 sm:mr-2" />
                Hints
              </TabsTrigger>
            </TabsList>
            {/* Scrollable area for tab content */}
            <div className="flex-grow overflow-y-auto p-4 text-sm">
              {/* Content for "Description" Tab */}
              <TabsContent value="description" className="mt-0">
                {/* Using Tailwind's Typography plugin classes for nice formatting if description is markdown */}
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                  {problem.description}
                </div>
                {/* Display Examples */}
                {problem.examples &&
                  Object.keys(problem.examples).length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-md font-semibold mb-1.5 text-slate-700 dark:text-slate-200">
                        Examples:
                      </h3>
                      {/* Shows example for the currently selected language */}
                      {problem.examples[selectedLanguageKey] ? (
                        <div className="p-2.5 bg-slate-100 dark:bg-slate-700/50 rounded border border-slate-200 dark:border-slate-600 text-xs space-y-1">
                          {/* Corrected structure for input/output, no <p><pre></p> */}
                          <div>
                            <strong className="text-slate-700 dark:text-slate-300">
                              Input:{" "}
                            </strong>
                            <pre className="inline bg-slate-200 dark:bg-slate-600 p-1 rounded ml-1 whitespace-pre-wrap">
                              {problem.examples[selectedLanguageKey].input}
                            </pre>
                          </div>
                          <div>
                            <strong className="text-slate-700 dark:text-slate-300">
                              Output:{" "}
                            </strong>
                            <pre className="inline bg-slate-200 dark:bg-slate-600 p-1 rounded ml-1 whitespace-pre-wrap">
                              {problem.examples[selectedLanguageKey].output}
                            </pre>
                          </div>
                          {problem.examples[selectedLanguageKey]
                            .explanation && (
                            <div className="mt-1">
                              <strong className="text-slate-700 dark:text-slate-300">
                                Explanation:{" "}
                              </strong>
                              <span>
                                {
                                  problem.examples[selectedLanguageKey]
                                    .explanation
                                }
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          No example for {selectedLanguageKey}.
                        </p>
                      )}
                    </div>
                  )}
                {/* Display Constraints */}
                {problem.constraints && (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold mb-1.5 text-slate-700 dark:text-slate-200">
                      Constraints:
                    </h3>
                    <div className="prose prose-xs dark:prose-invert max-w-none whitespace-pre-wrap">
                      {problem.constraints}
                    </div>
                  </div>
                )}
              </TabsContent>
              {/* Content for "Submissions" Tab */}
              <TabsContent value="submissions" className="mt-0">
                <h2 className="text-lg font-semibold mb-2">
                  Your Past Submissions
                </h2>
                {/* Placeholder for SubmissionsList component - this will be built later */}

                <SubmissionsList
                  submissions={pastSubmissions}
                  isLoading={isPastSubmissionsLoading}
                  problemId={problemId}
                />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Past submissions display area - To be implemented.
                </p>
              </TabsContent>
              {/* Content for "Discussion" Tab */}
              <TabsContent value="discussion" className="mt-0">
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                  Discussion feature coming soon.
                </p>
              </TabsContent>
              {/* Content for "Hints" Tab */}
              <TabsContent value="hints" className="mt-0">
                {problem.hints ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {problem.hints}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No hints for this problem.
                  </p>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        {/* Right Panel: Code Editor, Custom Input, Action Buttons, and Execution Results */}
        <div className="flex flex-col space-y-4 h-full">
          {/* Code Editor Card */}
          <Card className="flex-grow flex flex-col overflow-hidden">
            <CardHeader className="p-2 border-b bg-slate-50 dark:bg-slate-800 shrink-0">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Code Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-grow relative">
              {/* Editor needs parent with defined height */}
              <Editor
                height="100%"
                language={languageToMonacoKey(selectedLanguageKey)}
                theme="vs-dark"
                value={userCode}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 16,
                  lineNumbers: "on",
                  automaticLayout: true,
                  wordWrap: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                }}
              />
            </CardContent>
          </Card>

          {/* Custom Input & Action Buttons Card */}
          <Card className="shrink-0">
            {/* This card won't grow, good for fixed controls */}
            <CardContent className="p-3 space-y-2">
              {/* <div>
                <Label htmlFor="customInput" className="text-xs font-medium">
                  Custom Input (for "Run Code")
                </Label>
                <Textarea
                  id="customInput"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter custom input for 'Run Code' here..."
                  className="text-xs min-h-[50px] mt-1 font-mono bg-white dark:bg-slate-800"
                  disabled={executingAction !== null}
                />
              </div> */}
              <div className="flex justify-end items-center space-x-3">
                {/* "Run Code" button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRunCode}
                  disabled={executingAction !== null}
                >
                  {executingAction === "run" ? ( // Check if 'run' is the current action
                    "Running..."
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 mr-1.5" /> Run Code
                    </>
                  )}
                </Button>
                {/* "Submit Solution" button */}
                <Button
                  onClick={handleSubmitSolution}
                  size="sm"
                  disabled={executingAction !== null} // Disable if ANY action is executing
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {/* Updated button text logic to be simpler when `isExecuting` is true */}

                  {executingAction === "submit" ? ( // Check if 'submit' is the current action
                    "Processing..."
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1.5" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div>
        {/* Execution Results Card */}
        <Card className="mt-4 text-xs max-h-[350px] flex flex-col">
          {/* Max height, flex column */}
          <CardHeader className="p-2 border-b bg-slate-50 dark:bg-slate-800 shrink-0 sticky top-0 z-10">
            <CardTitle className="text-sm font-semibold">
              {/* Dynamically change title based on state */}
              {executingAction
                ? "Console"
                : currentExecutionResult
                ? "Execution Result"
                : executionError
                ? "Execution Error"
                : "Sample Test Cases"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 font-mono flex-grow overflow-y-auto">
            {" "}
            {/* Scrollable content */}
            {executingAction && (
              <p className="animate-pulse text-blue-600 dark:text-blue-400">
                {executingAction === "run"
                  ? "Running code..."
                  : "Submitting solution..."}
              </p>
            )}
            {!executingAction && executionError && (
              <div className="text-red-500 whitespace-pre-wrap">
                <strong>Error:</strong> {executionError}
              </div>
            )}
            {!executingAction && !executionError && currentExecutionResult && (
              // Use the new component to display detailed execution results
              <ExecutionResultDisplay
                executionResult={currentExecutionResult}
                problemTestCases={problem.testcases} // Pass original test cases for context
              />
            )}
            {/* Default: Show sample test cases if no execution active, no error, and no current result */}
            {!executingAction &&
              !executionError &&
              !currentExecutionResult &&
              (problem.testcases?.length > 0 ? (
                <div className="space-y-2">
                  {problem.testcases.map((tc, index) => (
                    <div
                      key={index}
                      className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded border border-slate-200 dark:border-slate-600"
                    >
                      <p className="font-medium text-xs text-slate-700 dark:text-slate-300">
                        Test Case {index + 1}
                      </p>
                      <div className="text-[10px] mt-0.5">
                        <strong className="text-slate-600 dark:text-slate-400">
                          Input:{" "}
                        </strong>
                        <pre className="inline whitespace-pre-wrap">
                          {tc.input}
                        </pre>
                      </div>
                      <div className="text-[10px] mt-0.5">
                        <strong className="text-slate-600 dark:text-slate-400">
                          Expected Output:{" "}
                        </strong>
                        <pre className="inline whitespace-pre-wrap">
                          {tc.output}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No sample test cases available for this problem.
                </p>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProblemDetailPage;
