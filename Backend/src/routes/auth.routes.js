import { Router } from "express";

import {LoginUser, LogoutUser, register, VerifyUser} from "../controllers/auth.controller.js"
import { validateLoginUser, validateRegisterUser } from "../middlewares/UserValidation.middleware.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router=Router();

router.route("/register")
.post(validateRegisterUser,register)

router.route("/verify/:Incomingtoken")
.get(VerifyUser)

router.route("/login")
.get(validateLoginUser,LoginUser)

router.route("/logout")
.get(isLoggedIn,LogoutUser)

export default router;