import { Router } from "express";
import {isLoggedIn} from "../middlewares/auth.middleware.js";
import { getAllSubmission, getSubmissionCountForProblem, getSubmissionForProblem } from "../controllers/submission.controller.js";

const router=Router();


router.route("/get-all-submissions")
.get(isLoggedIn,getAllSubmission);

router.route("/get-submission/:problemlId")
.get(isLoggedIn,getSubmissionForProblem); 

router.route("/get-submission-count/:problemId")
.get(isLoggedIn,getSubmissionCountForProblem);
 

export default router;
