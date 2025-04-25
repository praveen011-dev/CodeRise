import { Router } from "express";

import {register, VerifyUser} from "../controllers/auth.controller.js"
import { validateRegisterUser } from "../middlewares/UserValidation.middleware.js";

const router=Router();

router.route("/register")
.post(validateRegisterUser,register)

router.route("/verify/:Incomingtoken")
.get(VerifyUser)

export default router;