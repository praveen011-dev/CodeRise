import express from "express"

import { Router } from "express"

import { executeCode } from "../controllers/executeCode.controller.js"
import {isLoggedIn } from "../middlewares/auth.middleware.js";

const router=Router();

router.route("/")
.post(isLoggedIn,executeCode)

export default router