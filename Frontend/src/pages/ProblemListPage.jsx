// src/pages/ProblemListPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAllProblems } from "../services/problemService"; // Adjust path if your service file is elsewhere

// If you want to use Shadcn/UI components like Card, import them here:
// import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

function ProblemListPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProblems = async () => {
      try {
        setLoading(true); // Set loading before the fetch call
        const fetchedProblems = await fetchAllProblems();
        setProblems(fetchedProblems || []);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Failed to load problems:", err); // Log the actual error
        setError(err.message || "An unknown error occurred"); //Set a user-friendly error msg
        setProblems([]); // Clear problems on error
      } finally {
        setLoading(false); // Set loading to false in both success and error cases
      }
    };

    getProblems();
  }, []); // Empty dependency array makes this effect run once when the component mounts

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center">
        Loading problems...
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

  if (problems.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        No problems found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-slate-800">
        Problem Set
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((problem) => (
          <Link
            key={problem.id}
            to={`/problems/${problem.id}`}
            className="block hover:no-underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg"
          >
            {/* You can replace this div with a Shadcn/UI Card component if you prefer */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out border border-slate-200 h-full flex flex-col">
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                {problem.title || "Untitled Problem"}
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                Difficulty:
                <span
                  className={`ml-1 font-medium px-2 py-0.5 rounded-full text-xs ${
                    problem.difficulty === "Easy"
                      ? "bg-green-100 text-green-700"
                      : problem.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : problem.difficulty === "Hard"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700" // Default style
                  }`}
                >
                  {problem.difficulty || "N/A"}
                </span>
              </p>
              {/* You can add more details here if your API provides them, e.g., tags */}
              {/* <p className="text-xs text-gray-400">ID: {problem.id}</p> */}
              {/* Add a placeholder for description if you want to show a snippet */}
              {/* <p className="text-sm text-gray-700 mt-auto pt-2">
                {problem.shortDescription || "Click to view details..."}
              </p> */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProblemListPage;
