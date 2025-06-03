import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  getAllSubmission,
  getSubmissionCountForProblem,
  getSubmissionForProblem,
} from "../controllers/submission.controller.js";

const router = Router();

router.route("/get-submissions").get(isLoggedIn, getAllSubmission);

router
  .route("/get-submissions/:problemId")
  .get(isLoggedIn, getSubmissionForProblem);

router
  .route("/get-submissions-count/:problemId")
  .get(isLoggedIn, getSubmissionCountForProblem);

export default router;
