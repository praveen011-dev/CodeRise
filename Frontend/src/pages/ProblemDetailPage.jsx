import React from "react";
import { useParams } from "react-router-dom";

function ProblemDetailPage() {
  const { problemId } = useParams();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Problem Detail Page</h1>
      <p className="mt-2">
        Details for problem ID:{" "}
        <span className="font-semibold text-blue-600">{problemId}</span>
      </p>
    </div>
  );
}
export default ProblemDetailPage;
