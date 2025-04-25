import { Router } from "express";

import {LoginUser, register, VerifyUser} from "../controllers/auth.controller.js"
import { validateLoginUser, validateRegisterUser } from "../middlewares/UserValidation.middleware.js";

const router=Router();

router.route("/register")
.post(validateRegisterUser,register)

router.route("/verify/:Incomingtoken")
.get(VerifyUser)

router.route("/login")
.get(validateLoginUser,LoginUser)


export default router;