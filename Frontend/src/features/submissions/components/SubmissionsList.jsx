import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNowStrict } from "date-fns"; // For "X time ago"

// --- MODIFIED HELPER FUNCTIONS ---

// This safeParse is likely not needed if tc.time/tc.memory are direct strings from Judge0,
// but it's harmless to keep if you're unsure of your backend's exact storage format.
const safeParse = (dataString) => {
  try {
    const parsed = JSON.parse(dataString || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    // console.error("Failed to parse JSON string:", dataString, e); 
    return [];
  }
};

// New version: accepts an array of test case objects
const calculateAverageMemoryFromTestcases = (testcases) => {
  if (!testcases || testcases.length === 0) return 0;

  const memoryValues = testcases
    .map((tc) => parseFloat(String(tc.memory || "0").replace(/kb/i, ""))) // Extract memory from each tc object
    .filter((m) => !isNaN(m)); // Filter out any NaN results

  if (memoryValues.length === 0) return 0; // If no valid numbers found
  return memoryValues.reduce((a, b) => a + b, 0) / memoryValues.length;
};

// New version: accepts an array of test case objects
const calculateAverageTimeFromTestcases = (testcases) => {
  if (!testcases || testcases.length === 0) return 0;

  const timeValues = testcases
    .map((tc) => parseFloat(String(tc.time || "0").replace(/s/i, ""))) // Extract time from each tc object
    .filter((t) => !isNaN(t)); // Filter out any NaN results

  if (timeValues.length === 0) return 0; // If no valid numbers found
  return timeValues.reduce((a, b) => a + b, 0) / timeValues.length;
};

// --- END MODIFIED HELPER FUNCTIONS ---

function SubmissionsList({ submissions, isLoading }) {
  if (isLoading) {
    return (
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">
        Loading submissions...
      </p>
    );
  }
  if (!submissions || submissions.length === 0) {
    return (
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">
        No past submissions for this problem yet.
      </p>
    );
  }

  const getStatusBadge = (status) => {
    if (!status) return <Badge variant="secondary">Unknown</Badge>;
    const lowerStatus = status.toLowerCase();

    if (lowerStatus.includes("accepted")) {
      return (
        <Badge className="bg-green-500 hover:bg-green-600 text-white">
          Accepted
        </Badge>
      );
    } else if (lowerStatus.includes("wrong answer")) {
      return <Badge variant="destructive">Wrong Answer</Badge>;
    } else if (lowerStatus.includes("time limit exceeded")) {
      return (
        <Badge
          variant="destructive"
          className="bg-orange-500 hover:bg-orange-600"
        >
          TLE
        </Badge>
      );
    } else if (lowerStatus.includes("compilation error")) {
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          Compilation Error
        </Badge>
      );
    } else if (lowerStatus.includes("runtime error")) {
      return (
        <Badge
          variant="destructive"
          className="bg-purple-500 hover:bg-purple-600"
        >
          Runtime Error
        </Badge>
      );
    }
    // Default badge for other statuses
    return <Badge variant="secondary">{status}</Badge>;
  };

  return (
    <ScrollArea className="h-[300px] md:h-[400px] w-full rounded-md border dark:border-slate-700">
      <Table className="text-xs sm:text-sm">
        <TableHeader className="sticky top-0 bg-slate-100 dark:bg-slate-800 z-10">
          <TableRow>
            <TableHead className="w-[150px] sm:w-[180px] px-3 py-2.5">
              Submitted
            </TableHead>
            <TableHead className="px-3 py-2.5">Status</TableHead>
            <TableHead className="px-3 py-2.5">Language</TableHead>
            <TableHead className="text-right px-3 py-2.5">
              Avg. Runtime
            </TableHead>
            <TableHead className="text-right px-3 py-2.5">
              Avg. Memory
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((sub) => {
            // <<< IMPORTANT: Call new helper functions with sub.testcases >>>
            const avgTime = calculateAverageTimeFromTestcases(sub.testcases);
            const avgMemory = calculateAverageMemoryFromTestcases(
              sub.testcases
            );

            return (
              <TableRow
                key={sub.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <TableCell
                  className="font-medium px-3 py-2"
                  // Ensure sub.createdAt or sub.submittedAt is the correct timestamp field.
                  // 'submittedAt' is often used for ordering in backend, usually correct for display.
                  title={new Date(
                    sub.submittedAt || sub.createdAt
                  ).toLocaleString()}
                >
                  {formatDistanceToNowStrict(
                    new Date(sub.submittedAt || sub.createdAt),
                    {
                      addSuffix: true,
                    }
                  )}
                </TableCell>
                <TableCell className="px-3 py-2">
                  {getStatusBadge(sub.status)}
                </TableCell>
                <TableCell className="px-3 py-2">
                  {sub.language || "N/A"}
                </TableCell>
                <TableCell className="text-right px-3 py-2">
                  {avgTime > 0 ? `${avgTime.toFixed(3)}s` : "N/A"}
                </TableCell>
                <TableCell className="text-right px-3 py-2">
                  {avgMemory > 0 ? `${avgMemory.toFixed(0)}KB` : "N/A"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

export default SubmissionsList;
