import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { db } from "../libs/db.js";

// Helper function to get start of day in UTC for consistent date grouping
const getStartOfDay = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0); // Set to start of day in UTC
  return d;
};

// 1. Get Solved Problems Count
const getSolvedProblemsCount = asyncHandler(async (req, res, next) => {
  const userId = req.user.id; // Get user ID from authenticated request

  if (!userId) {
    return next(new ApiError(401, "User not authenticated."));
  }

  const count = await db.problemSolved.count({
    where: { userId: userId },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { count },
        "Solved problems count fetched successfully.",
      ),
    );
});

// 2. Get User Submissions Count
const getSubmissionsCount = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  if (!userId) {
    return next(new ApiError(401, "User not authenticated."));
  }

  const count = await db.submission.count({
    where: { userId: userId },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { count },
        "Submissions count fetched successfully.",
      ),
    );
});

// 3. Get User Playlists Count
const getPlaylistsCount = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  if (!userId) {
    return next(new ApiError(401, "User not authenticated."));
  }

  const count = await db.playlist.count({
    where: { userId: userId },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { count }, "Playlists count fetched successfully."),
    );
});

// 4. Get User Contribution Data (for heatmap)
const getUserContributions = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  if (!userId) {
    return next(new ApiError(401, "User not authenticated."));
  }

  // Get data for the last year (or customize duration)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  // Ensure it's start of day UTC
  const startDate = getStartOfDay(oneYearAgo);

  // Fetch all relevant activities:
  // Here, we consider 'problemSolved' as a contribution. You can also include 'submissions'
  // if you want to count every submission. For a LeetCode clone, 'solved problems' is a common metric.
  const contributions = await db.problemSolved.findMany({
    where: {
      userId: userId,
      createdAt: { gte: startDate }, // Greater than or equal to start date
    },
    select: {
      createdAt: true, // Only need the creation timestamp
    },
    orderBy: {
      createdAt: "asc", // Order by date for easier aggregation
    },
  });

  // Aggregate data by date
  const dailyCounts = contributions.reduce((acc, entry) => {
    // Use UTC date string to avoid timezone issues for daily grouping
    const dateString = getStartOfDay(entry.createdAt)
      .toISOString()
      .split("T")[0]; // "YYYY-MM-DD"
    acc[dateString] = (acc[dateString] || 0) + 1;
    return acc;
  }, {});

  // Convert to array of { date: "YYYY-MM-DD", count: N } format
  const formattedContributions = Object.keys(dailyCounts).map((date) => ({
    date: date,
    count: dailyCounts[date],
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        formattedContributions,
        "User contribution data fetched successfully.",
      ),
    );
});

// NEW: Get User Submissions List
const getUserSubmissions = asyncHandler(async (req, res, next) => {
  const userId = req.user.id; // From isLoggedIn middleware

  if (!userId) {
    return next(new ApiError(401, "User not authenticated."));
  }

  const submissions = await db.submission.findMany({
    where: { userId: userId },
    // Select specific fields to avoid sending too much data, and include problem info
    select: {
      id: true,
      problemId: true,
      language: true,
      status: true, // Accepted, Wrong Answer, etc.
      createdAt: true,
      sourceCode:true,
      stdin:true,
      stdout:true,
      compileOutput:true,
      memory:true,
      problem: {
        // Include related problem details
        select: {
          id: true,
          title: true,
          difficulty: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc", // Most recent submissions first
    },
    // You might add pagination here later if needed
  });

  // Calculate accepted/wrong answer counts
  const acceptedCount = submissions.filter(
    (s) => s.status === "Accepted",
  ).length;
  const wrongAnswerCount = submissions.filter(
    (s) => s.status === "Wrong Answer",
  ).length; // Assuming these statuses

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total: submissions.length,
        accepted: acceptedCount,
        wrongAnswer: wrongAnswerCount,
        list: submissions,
      },
      "User submissions fetched successfully.",
    ),
  );
});

// NEW: Get User Solved Problems List
const getUserSolvedProblems = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  if (!userId) {
    return next(new ApiError(401, "User not authenticated."));
  }

  const solvedProblems = await db.problemSolved.findMany({
    where: { userId: userId },
    select: {
      id: true,
      problemId: true,
      createdAt: true,
      problem: {
        // Include related problem details
        select: {
          id: true,
          title: true,
          difficulty: true,
          tags: true, // Include tags
        },
      },
    },
    orderBy: {
      createdAt: "desc", // Most recently solved first
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        solvedProblems,
        "User solved problems fetched successfully.",
      ),
    );
});

// NEW: Get User Playlists List
const getUserPlaylists = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  if (!userId) {
    return next(new ApiError(401, "User not authenticated."));
  }

  const playlists = await db.playlist.findMany({
    where: { userId: userId },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      // You might want to count problems in each playlist later
      // _count: {
      //     select: { problems: true },
      // },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlists, "User playlists fetched successfully."),
    );
});

export {
  getSolvedProblemsCount,
  getSubmissionsCount,
  getPlaylistsCount,
  getUserContributions,
  getUserSubmissions,
  getUserSolvedProblems,
  getUserPlaylists,
  // export other functions if you add them
};
