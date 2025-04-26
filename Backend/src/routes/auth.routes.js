import { Router } from "express";

import {ForgetPassword, LoginUser, LogoutUser, register, VerifyUser,ResetPassword,ChangePassword,GetProfile,ResendEmailVerification,RefreshAccesstoken} from "../controllers/auth.controller.js"

import { validateLoginUser, validateRegisterUser,validateForgetPass,validateResetPass,validateChangeCurrPass } from "../middlewares/UserValidation.middleware.js";

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

router.route("/forget-pass")
.post(validateForgetPass,ForgetPassword)

router.route("/reset-pass/:Incomingtoken")
.post(validateResetPass,ResetPassword)


router.route("/refresh-accessToken")
.get(RefreshAccesstoken)


//Secured Routes

router.route("/change-pass")
.post(validateChangeCurrPass,isLoggedIn,ChangePassword)

router.route("/get-profile")
.get(isLoggedIn,GetProfile)

router.route("/resend-email-verify")
.post(isLoggedIn,ResendEmailVerification)


export default router;