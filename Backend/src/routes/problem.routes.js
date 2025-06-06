import { Router } from "express";
import { isAdmin, isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getProblemById,
  getProblemSolvedByUser,
  getTotalProblemsCount,
  updateProblem,
} from "../controllers/problem.controller.js";
import {
  validateCreateProblem,
  validateUpdateProblem,
} from "../middlewares/problemValidation.middleware.js";

const router = Router();

router
  .route("/")
  .post(isLoggedIn, isAdmin, validateCreateProblem, createProblem)
  .get(isLoggedIn, getAllProblems);

// NEW Route for problem count
router.route("/count").get(getTotalProblemsCount);
router.route("/:id").get(isLoggedIn, getProblemById);

router
  .route("/update-problem/:id")
  .put(isLoggedIn, isAdmin, validateUpdateProblem, updateProblem);

router.route("/delete-problem/:id").delete(isLoggedIn, isAdmin, deleteProblem);

router.route("/get-solved-problems").get(isLoggedIn, getProblemSolvedByUser);

export default router;
