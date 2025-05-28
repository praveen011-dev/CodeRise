// src/pages/ProblemDetailPage.jsx (or your chosen path)
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchProblemById } from "../services/problemService"; // Adjust path if needed
// To render Markdown for description (optional, install 'react-markdown' if you use it)
// import ReactMarkdown from 'react-markdown';

function ProblemDetailPage() {
  const { problemId } = useParams(); // Get problemId from URL parameters
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(problemId);
    const loadProblemDetails = async () => {
      if (!problemId) return; // Should not happen if route is set up correctly

      try {
        setLoading(true);
        const fetchedProblem = await fetchProblemById(problemId);
        setProblem(fetchedProblem);
        setError(null);
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

  // Placeholder for problem structure - adjust based on your actual problem object
  const { title, description, difficulty, constraints, examples, tags } =
    problem;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-slate-800">
          {title || "Problem Title"}
        </h1>

        <div className="mb-4">
          <span
            className={`font-medium px-3 py-1 rounded-full text-sm ${
              difficulty === "EASY"
                ? "bg-green-100 text-green-700" // Assuming "EASY" from your Postman example
                : difficulty === "MEDIUM"
                ? "bg-yellow-100 text-yellow-700"
                : difficulty === "HARD"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {difficulty || "N/A"}
          </span>
        </div>

        {tags && tags.length > 0 && (
          <div className="mb-6">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-slate-200 text-slate-700 px-2 py-1 rounded-full text-xs mr-2 mb-2 inline-block"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-3 text-slate-700">
          Description
        </h2>
        <div className="prose prose-slate max-w-none mb-6">
          {/* If description is Markdown: <ReactMarkdown>{description || ''}</ReactMarkdown> */}
          {/* If description is plain text or pre-formatted HTML: */}
          <p>{description || "No description available."}</p>
        </div>

        {examples && Object.keys(examples).length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-slate-700">
              Examples
            </h3>
            {Object.entries(examples).map(([lang, exampleData], index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-slate-50 rounded-md border border-slate-200"
              >
                <p className="font-mono text-sm">
                  <strong>Input ({lang}):</strong> {exampleData.input}
                </p>
                <p className="font-mono text-sm">
                  <strong>Output ({lang}):</strong> {exampleData.output}
                </p>
                {exampleData.explanation && (
                  <p className="text-sm mt-1 text-slate-600">
                    <strong>Explanation:</strong> {exampleData.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {constraints && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-slate-700">
              Constraints
            </h3>
            <div className="prose prose-sm prose-slate max-w-none">
              {/* If constraints is Markdown: <ReactMarkdown>{constraints}</ReactMarkdown> */}
              <p>{constraints}</p>
            </div>
          </div>
        )}

        {/* Code editor and submission area will go here later */}
        <div className="mt-8 p-4 bg-gray-100 rounded-md">
          Code Editor and Submission Area - Coming Soon!
        </div>
      </div>
    </div>
  );
}

export default ProblemDetailPage;
