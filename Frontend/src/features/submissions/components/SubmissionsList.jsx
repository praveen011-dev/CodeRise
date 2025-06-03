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

// Your helper functions (or import them if they are in a separate utils file)
const safeParse = (dataString) => {
  // Assuming this is your safe JSON parse
  try {
    return JSON.parse(dataString || "[]"); // Default to empty array string if dataString is null/undefined
  } catch (e) {
    console.error("Failed to parse JSON string:", dataString, e);
    return [];
  }
};

const calculateAverageMemory = (memoryDataString) => {
  const memoryArray = safeParse(memoryDataString).map((m) =>
    parseFloat(String(m).replace(/kb/i, ""))
  ); // Handle "KB" and ensure string
  if (memoryArray.length === 0 || memoryArray.some(isNaN)) return 0; // Check for NaN after parseFloat
  return memoryArray.reduce((a, b) => a + b, 0) / memoryArray.length;
};

const calculateAverageTime = (timeDataString) => {
  const timeArray = safeParse(timeDataString).map((t) =>
    parseFloat(String(t).replace(/s/i, ""))
  ); // Handle "s" and ensure string
  if (timeArray.length === 0 || timeArray.some(isNaN)) return 0;
  return timeArray.reduce((a, b) => a + b, 0) / timeArray.length;
};

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
        {/* Slightly larger base text on sm+ */}
        <TableHeader className="sticky top-0 bg-slate-100 dark:bg-slate-800 z-10">
          {/* Sticky header */}
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
            // Calculate averages for each submission
            const avgTime = calculateAverageTime(sub.time); // sub.time is the stringified array "[\"0.1s\", ...]"
            const avgMemory = calculateAverageMemory(sub.memory); // sub.memory is "[\"1024KB\", ...]"

            return (
              <TableRow
                key={sub.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <TableCell
                  className="font-medium px-3 py-2"
                  title={new Date(sub.createdAt).toLocaleString()}
                >
                  {formatDistanceToNowStrict(new Date(sub.createdAt), {
                    addSuffix: true,
                  })}
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
