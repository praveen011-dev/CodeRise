import React from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Code2 as MemoryIcon,
} from "lucide-react"; // Using Code2 for Memory for now
import { Card, CardContent } from "@/components/ui/card"; // Using Shadcn Card
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Helper function to safely parse JSON strings (if your backend still sends time/memory as stringified arrays)
const safeParse = (dataString) => {
  try {
    return JSON.parse(dataString || "[]");
  } catch (e) {
    return []; // Return empty if parsing fails
  }
};

// Helper to get badge styling for individual test case status
const getTestCaseStatusBadge = (statusText, passed) => {
  if (passed)
    return (
      <Badge className="bg-green-500 hover:bg-green-500 text-white">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Passed
      </Badge>
    );
  if (!statusText) return <Badge variant="secondary">Unknown</Badge>;
  const lowerStatus = statusText.toLowerCase();
  if (lowerStatus.includes("wrong answer"))
    return (
      <Badge variant="destructive">
        <XCircle className="w-3 h-3 mr-1" />
        Wrong Answer
      </Badge>
    );
  // Add more specific badges for TLE, MLE, CE, RE based on statusText from Judge0/Sulu
  return (
    <Badge variant="destructive">
      <XCircle className="w-3 h-3 mr-1" />
      {statusText}
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

  // --- Calculate Aggregate/Average Metrics ---
  let displayTime = "N/A";
  let displayMemory = "N/A";

  // Option 2: Fallback to calculating average if backend sends arrays (as per your DaisyUI example)
  // This assumes executionResult.time and executionResult.memory are stringified JSON arrays.

  if (executionResult.time) {
    const timeArray = safeParse(executionResult.time).map((t) =>
      parseFloat(String(t).replace(/s/i, ""))
    );
    if (timeArray.length > 0 && !timeArray.some(isNaN)) {
      displayTime = `${(
        timeArray.reduce((a, b) => a + b, 0) / timeArray.length
      ).toFixed(3)}s (Avg)`;
    }
  }
  if (executionResult.memory) {
    const memoryArray = safeParse(executionResult.memory).map((m) =>
      parseFloat(String(m).replace(/kb/i, ""))
    );
    if (memoryArray.length > 0 && !memoryArray.some(isNaN)) {
      displayMemory = `${(
        memoryArray.reduce((a, b) => a + b, 0) / memoryArray.length
      ).toFixed(0)}KB (Avg)`;
    }
  }

  const passedTests =
    executionResult.testcases?.filter((tc) => tc.passed).length || 0;
  const totalRunTests = executionResult.testcases?.length || 0;
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
      {executionResult.testcases && executionResult.testcases.length > 0 && (
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
                {executionResult.testcases.map((tc, index) => (
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
