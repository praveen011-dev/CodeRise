import React from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Code2 as MemoryIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Helper function to safely parse JSON strings (not strictly needed if backend sends arrays directly now,
// but good to keep if there's a chance of stringified data)
const safeParse = (dataString) => {
  try {
    const parsed = JSON.parse(dataString || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

// Helper to get badge styling and TEXT for individual test case status
const getTestCaseStatusBadge = (statusText, passed) => {
  if (passed) {
    return (
      <Badge className="bg-green-500 hover:bg-green-500 text-white">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Passed
      </Badge>
    );
  }

  // If NOT passed (i.e., failed), determine appropriate text and color
  const lowerStatus = statusText?.toLowerCase();
  let badgeText = "Failed"; // Default text for a failed test

  // Be explicit about known failure statuses
  if (lowerStatus?.includes("wrong answer")) {
    badgeText = "Wrong Answer";
  } else if (lowerStatus?.includes("time limit exceeded")) {
    badgeText = "Time Limit Exceeded";
  } else if (lowerStatus?.includes("memory limit exceeded")) {
    badgeText = "Memory Limit Exceeded";
  } else if (lowerStatus?.includes("compilation error")) {
    badgeText = "Compilation Error";
  } else if (lowerStatus?.includes("runtime error")) {
    badgeText = "Runtime Error";
  }
  // If statusText is "Accepted" but passed is false, we still show "Failed" or "Wrong Answer"
  // based on the logic above, overriding the misleading "Accepted" text from Judge0.

  return (
    <Badge variant="destructive">
      <XCircle className="w-3 h-3 mr-1" />
      {badgeText} 
    </Badge>
  );
};

function ExecutionResultDisplay({ executionResult }) {
  if (!executionResult) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No execution results to display.
      </p>
    );
  }

  let displayTime = "N/A";
  let displayMemory = "N/A";

  const testcases = executionResult.testcases || [];

  // Calculate average time
  const times = testcases
    .map((tc) => parseFloat(String(tc.time || "0").replace(/s/i, "")))
    .filter((t) => !isNaN(t));

  if (times.length > 0) {
    const totalTime = times.reduce((sum, t) => sum + t, 0);
    displayTime = `${(totalTime / times.length).toFixed(3)}s (Avg)`;
  }

  // Calculate average memory
  const memories = testcases
    .map((tc) => parseFloat(String(tc.memory || "0").replace(/KB/i, "")))
    .filter((m) => !isNaN(m));

  if (memories.length > 0) {
    const totalMemory = memories.reduce((sum, m) => sum + m, 0);
    displayMemory = `${(totalMemory / memories.length).toFixed(0)}KB (Avg)`;
  }

  const passedTests = testcases.filter((tc) => tc.passed).length || 0;
  const totalRunTests = testcases.length || 0;
  const successRate =
    totalRunTests > 0 ? (passedTests / totalRunTests) * 100 : 0;

  return (
    <div className="space-y-4 text-xs">
      {/* Overall Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-md">
          <div className="text-[10px] uppercase text-slate-500 dark:text-slate-400">
            Status
          </div>
          <div
            className={`text-sm font-bold mt-0.5 ${
              executionResult.status === "Accepted"
                ? "text-green-500 dark:text-green-400"
                : "text-red-500 dark:text-red-400"
            }`}
          >
            {executionResult.status || "N/A"}
          </div>
        </div>
        <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-md">
          <div className="text-[10px] uppercase text-slate-500 dark:text-slate-400">
            Success Rate
          </div>
          <div className="text-sm font-bold mt-0.5">
            {successRate.toFixed(1)}% ({passedTests}/{totalRunTests})
          </div>
        </div>
        <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-md">
          <div className="text-[10px] uppercase text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
            <Clock size={10} /> Runtime
          </div>
          <div className="text-sm font-bold mt-0.5">{displayTime}</div>
        </div>
        <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-md">
          <div className="text-[10px] uppercase text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
            <MemoryIcon size={10} /> Memory
          </div>
          <div className="text-sm font-bold mt-0.5">{displayMemory}</div>
        </div>
      </div>

      {/* Detailed Test Case Results Table */}
      {testcases && testcases.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold mb-1.5 text-slate-700 dark:text-slate-200">
            Test Case Breakdown:
          </h4>
          <div className="overflow-x-auto rounded-md border dark:border-slate-700">
            <Table>
              <TableHeader>
                <TableRow className="text-[11px]">
                  <TableHead className="h-7 px-2">Case</TableHead>
                  <TableHead className="h-7 px-2">Status</TableHead>
                  <TableHead className="h-7 px-2">Your Output</TableHead>
                  <TableHead className="h-7 px-2">Expected</TableHead>
                  <TableHead className="text-right h-7 px-2">Time</TableHead>
                  <TableHead className="text-right h-7 px-2">Memory</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testcases.map((tc, index) => (
                  <TableRow
                    key={index}
                    className={
                      !tc.passed ? "bg-red-50/30 dark:bg-red-900/20" : undefined
                    }
                  >
                    <TableCell className="font-medium px-2 py-1">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-2 py-1">
                      {getTestCaseStatusBadge(tc.status, tc.passed)}
                    </TableCell>
                    <TableCell className="font-mono px-2 py-1">
                      <pre className="whitespace-pre-wrap max-w-[150px] overflow-x-auto">
                        {tc.stdout !== null ? tc.stdout : "N/A"}
                      </pre>
                    </TableCell>
                    <TableCell className="font-mono px-2 py-1">
                      <pre className="whitespace-pre-wrap max-w-[150px] overflow-x-auto">
                        {tc.expectedOutput !== null ? tc.expectedOutput : "N/A"}
                      </pre>
                    </TableCell>
                    <TableCell className="text-right px-2 py-1">
                      {tc.time || "N/A"}
                    </TableCell>
                    <TableCell className="text-right px-2 py-1">
                      {tc.memory || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      {/* Display Compile Output or Stderr if present on the main submission object */}
      {executionResult.compileOutput && (
        <div className="mt-2">
          <h4 className="text-xs font-semibold text-orange-500 dark:text-orange-400">
            Compile Output:
          </h4>
          <pre className="text-xs bg-slate-100 dark:bg-slate-700 p-2 rounded whitespace-pre-wrap">
            {executionResult.compileOutput}
          </pre>
        </div>
      )}
      {executionResult.stderr && (
        <div className="mt-2">
          <h4 className="text-xs font-semibold text-red-500 dark:text-red-400">
            Runtime Error (stderr):
          </h4>
          <pre className="text-xs bg-slate-100 dark:bg-slate-700 p-2 rounded whitespace-pre-wrap">
            {executionResult.stderr}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ExecutionResultDisplay;
