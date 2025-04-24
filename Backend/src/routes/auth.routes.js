import { Router } from "express";

import {register} from "../controllers/auth.controller.js"
import { validateRegisterUser } from "../middlewares/UserValidation.middleware.js";

const router=Router();

router.route("/register")
.post(validateRegisterUser,register)

export default router;