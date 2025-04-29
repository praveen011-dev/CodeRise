import { Router } from "express";
import { isAdmin, isLoggedIn } from "../middlewares/auth.middleware.js";
import { createProblem, deleteProblem, getAllProblems, getProblemById, getProblemSolvedByUser, updateProblem } from "../controllers/problem.controller.js";

const router=Router();

router.route("/create-problem")
.post(isLoggedIn,isAdmin,createProblem)

router.route("/get-problems")
.get(isLoggedIn,getAllProblems)
 
router.route("/get-problem/:id")
.get(isLoggedIn,getProblemById)

router.route("/update-problem/:id")
.put(isLoggedIn,isAdmin,updateProblem)

router.route("/delete-problem/:id")
.delete(isLoggedIn,isAdmin,deleteProblem)

router.route("/get-solved-problems")
.get(isLoggedIn,getProblemSolvedByUser)



export default router;