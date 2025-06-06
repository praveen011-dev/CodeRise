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
  CardDescription, // Not used in this snippet but kept for completeness
  CardHeader,
  CardTitle,
  CardFooter, // Not used in this snippet but kept for completeness
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; // Used for custom input
import { Label } from "@/components/ui/label"; // Not used in this snippet but kept for completeness

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
  Clock, // Not used in this snippet but kept for completeness
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

  const {
    getProblemById,
    problem,
    isLoading: isProblemLoading,
    error: problemError,
    clearProblem,
  } = useProblemStore();

  const {
    submissions: pastSubmissions,
    isLoading: isPastSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const {
    runUserCode,
    submitUserSolution,
    submission: currentExecutionResult,
    executingAction,
    error: executionError,
    clearExecutionState,
  } = useExecutionStore();

  const [userCode, setUserCode] = useState("");
  const [selectedLanguageKey, setSelectedLanguageKey] = useState("JAVASCRIPT");
  const [customInput, setCustomInput] = useState("");
  const [activeInfoTab, setActiveInfoTab] = useState("description");

  // --- useEffect Hooks (for side effects like data fetching) ---
  useEffect(() => {
    if (problemId) {
      clearProblem();
      getProblemById(problemId);
      getSubmissionCountForProblem(problemId);
      clearExecutionState?.();
    }
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

  useEffect(() => {
    if (problem) {
      let codeToLoad = "";
      if (
        problem.isDemo &&
        problem.demoSolution &&
        problem.demoSolution[selectedLanguageKey]
      ) {
        codeToLoad = problem.demoSolution[selectedLanguageKey];
      } else if (
        problem.codeSnippet &&
        problem.codeSnippet[selectedLanguageKey]
      ) {
        codeToLoad = problem.codeSnippet[selectedLanguageKey];
      } else if (
        problem.codeSnippet &&
        Object.keys(problem.codeSnippet).length > 0
      ) {
        const firstAvailableLang = Object.keys(problem.codeSnippet)[0];
        if (selectedLanguageKey !== firstAvailableLang) {
          setSelectedLanguageKey(firstAvailableLang);
          return;
        } else {
          codeToLoad = problem.codeSnippet[firstAvailableLang] || "";
        }
      }
      setUserCode(codeToLoad);
    }
  }, [problem, selectedLanguageKey]);

  useEffect(() => {
    if (activeInfoTab === "submissions" && problemId) {
      getSubmissionForProblem(problemId);
    }
  }, [activeInfoTab, problemId, getSubmissionForProblem]);

  // --- Handler Functions ---
  const handleLanguageChange = (value) => {
    setSelectedLanguageKey(value);
  };

  const handleEditorChange = (value) => {
    setUserCode(value || "");
  };

  const handleRunCode = async () => {
    if (!problem || !problem.testcases) {
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

    let stdinArray, expectedOutputsArray;
    if (customInput.trim() !== "") {
      stdinArray = [customInput];
      expectedOutputsArray = [""];
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
      console.error("Submission failed (caught in component):", error);
    }
  };

  // --- Memoized Values ---
  const availableLanguages = useMemo(
    () => (problem?.codeSnippet ? Object.keys(problem.codeSnippet) : []),
    [problem?.codeSnippet]
  );

  // --- Conditional Rendering for Loading/Error States for the Page ---
  if (isProblemLoading || (problem === null && problemId)) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] text-foreground">
        <p className="text-lg">Loading problem...</p>
      </div>
    );
  }
  if (problemError) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] text-destructive">
        <p className="text-lg">Error: {problemError}</p>
      </div>
    );
  }
  if (!problem) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] text-foreground">
        <p className="text-lg">Problem not found.</p>
      </div>
    );
  }

  // --- Main JSX Return (Renders the Page UI) ---
  return (
    // Removed specific background classes from here, let body handle it
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Top Info Bar */}
      <div
        className="
        sticky top-0 z-10 border-b border-border/50 shadow-sm
        bg-background/80 backdrop-blur-md transition-colors duration-500
      "
      >
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left side of top bar: Breadcrumbs / Title */}
          <div className="flex items-center gap-2 overflow-hidden">
            <Link
              to="/problems"
              className="text-primary hover:text-primary/80 shrink-0"
            >
              <Home className="w-5 h-5" />
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            <h1
              className="text-md font-semibold truncate flex items-center gap-2 text-foreground"
              title={problem.title}
            >
              {problem.title}
              {problem.isDemo && (
                <Badge
                  variant="outline"
                  className="bg-blue-100/80 text-blue-700/80 border-blue-200/80 dark:bg-blue-900/80 dark:text-blue-300/80 dark:border-blue-700/80 text-[0.6rem] px-1 py-0.5 ml-1"
                >
                  DEMO
                </Badge>
              )}
            </h1>
            {/* Difficulty Badge */}
            <span
              className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                problem.difficulty === "EASY"
                  ? "bg-green-100/80 text-green-800/80 dark:bg-green-900/80 dark:text-green-200/80"
                  : problem.difficulty === "MEDIUM"
                  ? "bg-yellow-100/80 text-yellow-800/80 dark:bg-yellow-900/80 dark:text-yellow-200/80"
                  : problem.difficulty === "HARD"
                  ? "bg-red-100/80 text-red-800/80 dark:bg-red-900/80 dark:text-red-200/80"
                  : "bg-muted/80 text-muted-foreground/80"
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
              <SelectTrigger className="w-[130px] sm:w-[150px] h-9 text-xs sm:text-sm bg-input/80 text-foreground">
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
        style={{
          height: "calc(100vh - 3.5rem - 1.5rem)",
        }} /* Adjust height to match layout */
      >
        {/* Left Panel: Problem Information in Tabs */}
        <Card
          className="
            flex flex-col overflow-hidden shadow-xl relative z-10
            bg-card/70 border border-border/50
            backdrop-blur-md transition-colors duration-500
          "
        >
          <Tabs
            value={activeInfoTab}
            onValueChange={setActiveInfoTab}
            className="w-full flex flex-col flex-grow"
          >
            {/* Tab Triggers (Buttons to switch tabs) */}
            <TabsList
              className="
              grid w-full grid-cols-3 sm:grid-cols-4 rounded-none border-b border-border/50 shrink-0
              bg-muted/50 backdrop-blur-sm transition-colors duration-500
            "
            >
              <TabsTrigger
                value="description"
                className="text-xs p-2 sm:text-sm data-[state=active]:bg-background/70 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                <FileText className="w-3.5 h-3.5 mr-1 sm:mr-2" />
                Description
              </TabsTrigger>
              <TabsTrigger
                value="submissions"
                className="text-xs p-2 sm:text-sm data-[state=active]:bg-background/70 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                <Code2 className="w-3.5 h-3.5 mr-1 sm:mr-2" />
                Submissions ({submissionCount ?? 0})
              </TabsTrigger>
              <TabsTrigger
                value="discussion"
                className="text-xs p-2 sm:text-sm data-[state=active]:bg-background/70 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                <MessageSquare className="w-3.5 h-3.5 mr-1 sm:mr-2" />
                Discuss
              </TabsTrigger>
              <TabsTrigger
                value="hints"
                className="text-xs p-2 sm:text-sm data-[state=active]:bg-background/70 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                <Lightbulb className="w-3.5 h-3.5 mr-1 sm:mr-2" />
                Hints
              </TabsTrigger>
            </TabsList>
            {/* Scrollable area for tab content */}
            <div className="flex-grow overflow-y-auto p-4 text-sm text-foreground">
              {/* Content for "Description" Tab */}
              <TabsContent value="description" className="mt-0">
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                  {problem.description}
                </div>
                {problem.examples &&
                  Object.keys(problem.examples).length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-md font-semibold mb-1.5 text-foreground/80">
                        Examples:
                      </h3>
                      {problem.examples[selectedLanguageKey] ? (
                        <div className="p-2.5 bg-background/50 rounded border border-border/50 text-xs space-y-1">
                          <div>
                            <strong className="text-foreground/80">
                              Input:{" "}
                            </strong>
                            <pre className="inline bg-muted/50 p-1 rounded ml-1 whitespace-pre-wrap">
                              {problem.examples[selectedLanguageKey].input}
                            </pre>
                          </div>
                          <div>
                            <strong className="text-foreground/80">
                              Output:{" "}
                            </strong>
                            <pre className="inline bg-muted/50 p-1 rounded ml-1 whitespace-pre-wrap">
                              {problem.examples[selectedLanguageKey].output}
                            </pre>
                          </div>
                          {problem.examples[selectedLanguageKey]
                            .explanation && (
                            <div className="mt-1">
                              <strong className="text-foreground/80">
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
                        <p className="text-xs text-muted-foreground">
                          No example for {selectedLanguageKey}.
                        </p>
                      )}
                    </div>
                  )}
                {problem.constraints && (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold mb-1.5 text-foreground/80">
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
                <h2 className="text-lg font-semibold mb-2 text-foreground">
                  Your Past Submissions
                </h2>
                <SubmissionsList
                  submissions={pastSubmissions}
                  isLoading={isPastSubmissionsLoading}
                  problemId={problemId}
                />
                <p className="text-sm text-muted-foreground">
                  Past submissions display area - To be implemented.
                </p>
              </TabsContent>
              {/* Content for "Discussion" Tab */}
              <TabsContent value="discussion" className="mt-0">
                <p className="text-center text-sm text-muted-foreground">
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
                  <p className="text-sm text-muted-foreground">
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
          <Card
            className="
              flex-grow flex flex-col overflow-hidden shadow-xl relative z-10
              bg-card/70 border border-border/50
              backdrop-blur-md transition-colors duration-500
            "
          >
            <CardHeader className="p-2 border-b border-border/50 bg-background/50 shrink-0">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <Terminal className="w-4 h-4" /> Code Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-grow relative">
              <Editor
                height="100%"
                language={languageToMonacoKey(selectedLanguageKey)}
                theme="vs-dark" // Monaco editor theme, keep as is for dark mode
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
          <Card
            className="
              shrink-0 shadow-xl relative z-10
              bg-card/70 border border-border/50
              backdrop-blur-md transition-colors duration-500
            "
          >
            <CardContent className="p-3 space-y-2">
              {/* Custom Input (if uncommented) */}
              {/* <div>
                <Label htmlFor="customInput" className="text-xs font-medium text-foreground">
                  Custom Input (for "Run Code")
                </Label>
                <Textarea
                  id="customInput"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter custom input for 'Run Code' here..."
                  className="text-xs min-h-[50px] mt-1 font-mono bg-input/80 text-foreground"
                  disabled={executingAction !== null}
                />
              </div> */}
              <div className="flex justify-end items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRunCode}
                  disabled={executingAction !== null}
                >
                  {executingAction === "run" ? (
                    "Running..."
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 mr-1.5" /> Run Code
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleSubmitSolution}
                  size="sm"
                  disabled={executingAction !== null}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {executingAction === "submit" ? (
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
      {/* Execution Results Card - outside the grid, full width at the bottom */}
      <div className="container mx-auto p-3 pt-0">
        {" "}
        {/* Added pt-0 to reduce top padding if needed */}
        <Card
          className="
            mt-4 text-xs max-h-[350px] flex flex-col shadow-xl relative z-10
            bg-card/70 border border-border/50
            backdrop-blur-md transition-colors duration-500
          "
        >
          <CardHeader className="p-2 border-b border-border/50 bg-background/50 shrink-0 sticky top-0 z-10">
            <CardTitle className="text-sm font-semibold text-foreground">
              {executingAction
                ? "Console"
                : currentExecutionResult
                ? "Execution Result"
                : executionError
                ? "Execution Error"
                : "Sample Test Cases"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 font-mono flex-grow overflow-y-auto text-foreground">
            {executingAction && (
              <p className="animate-pulse text-primary">
                {executingAction === "run"
                  ? "Running code..."
                  : "Submitting solution..."}
              </p>
            )}
            {!executingAction && executionError && (
              <div className="text-destructive whitespace-pre-wrap">
                <strong>Error:</strong> {executionError}
              </div>
            )}
            {!executingAction && !executionError && currentExecutionResult && (
              <ExecutionResultDisplay
                executionResult={currentExecutionResult}
                problemTestCases={problem.testcases}
              />
            )}
            {!executingAction &&
              !executionError &&
              !currentExecutionResult &&
              (problem.testcases?.length > 0 ? (
                <div className="space-y-2">
                  {problem.testcases.map((tc, index) => (
                    <div
                      key={index}
                      className="p-2 bg-background/50 rounded border border-border/50"
                    >
                      <p className="font-medium text-xs text-foreground/80">
                        Test Case {index + 1}
                      </p>
                      <div className="text-[10px] mt-0.5">
                        <strong className="text-muted-foreground">
                          Input:{" "}
                        </strong>
                        <pre className="inline whitespace-pre-wrap">
                          {tc.input}
                        </pre>
                      </div>
                      <div className="text-[10px] mt-0.5">
                        <strong className="text-muted-foreground">
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
                <p className="text-xs text-muted-foreground">
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
