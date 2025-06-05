// src/routes/user.routes.js
import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js"; // Import your authentication middleware
import {
  getSolvedProblemsCount,
  getSubmissionsCount,
  getPlaylistsCount,
  getUserContributions,
  getUserSubmissions,
  getUserSolvedProblems,
  getUserPlaylists,
} from "../controllers/userProfile.controller.js"; // Import the new controller functions

const router = Router();

router.use(isLoggedIn); // Apply isLoggedIn middleware to all routes in this router

router.route("/:userId/solved-problems-count").get(getSolvedProblemsCount);
router.route("/:userId/submissions/count").get(getSubmissionsCount);
router.route("/:userId/playlists/count").get(getPlaylistsCount);
router.route("/:userId/contributions").get(getUserContributions);

// NEW ROUTES FOR DETAILED LISTS
router.route("/:userId/submissions").get(getUserSubmissions);
router.route("/:userId/solved-problems").get(getUserSolvedProblems);
router.route("/:userId/playlists").get(getUserPlaylists);

export default router;
