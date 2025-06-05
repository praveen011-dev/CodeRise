import { Router } from "express";

import {
  ForgetPassword,
  LoginUser,
  LogoutUser,
  register,
  VerifyUser,
  ResetPassword,
  ChangePassword,
  GetProfile,
  ResendEmailVerification,
  RefreshAccesstoken,
  updateProfilePicture,
} from "../controllers/auth.controller.js";

import {
  validateLoginUser,
  validateRegisterUser,
  validateForgetPass,
  validateResetPass,
  validateChangeCurrPass,
} from "../middlewares/UserValidation.middleware.js";

import { isLoggedIn } from "../middlewares/auth.middleware.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(validateRegisterUser, register);

router.route("/verify/:Incomingtoken").get(VerifyUser);

router.route("/login").post(validateLoginUser, LoginUser);

router.route("/logout").post(isLoggedIn, LogoutUser);

router.route("/forget-pass").post(validateForgetPass, ForgetPassword);

router
  .route("/reset-pass/:Incomingtoken")
  .post(validateResetPass, ResetPassword);

router.route("/refresh-accessToken").get(RefreshAccesstoken);

router
  .route("/profile/avatar")
  .post(isLoggedIn, upload.single("avatar"), updateProfilePicture); // 'avatar' is the field name for the file in the frontend FormData

//Secured Routes

router
  .route("/change-pass")
  .post(validateChangeCurrPass, isLoggedIn, ChangePassword);

router.route("/profile").get(isLoggedIn, GetProfile);

router.route("/resend-email-verify").post(isLoggedIn, ResendEmailVerification);

export default router;
