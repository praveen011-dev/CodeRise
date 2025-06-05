import { asyncHandler } from "../utils/asyncHandler.js";
import { db } from "../libs/db.js";
import dotenv from "dotenv";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { generateTemporaryToken } from "../mail/generateTempToken.js";
import {
  SendMail,
  emailVerificationMailGenContent,
  forgetPasswordMailGenContent,
} from "../mail/mail.js";
import {
  accessToken,
  refreshToken,
} from "../utils/AccessToken&RefreshToken.js";
import { cloudinary } from "../utils/cloudinary.js";

dotenv.config();

const updateProfilePicture = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  if (!req.file) {
    return next(new ApiError(400, "No image file uploaded."));
  }

  const newProfilePictureUrl = req.file.path;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { image: true },
  });

  if (user?.image) {
    // Extract public_id from Cloudinary URL:
    // e.g., "https://res.cloudinary.com/your_cloud_name/image/upload/v12345/CodeRise_Avatars/abc123def456.jpg"
    // We need "CodeRise_Avatars/abc123def456"
    const publicIdWithFolder = user.image
      .split("/")
      .slice(-2) // Take last two parts (folder name, filename with extension)
      .join("/") // Join back to "folder/filename.ext"
      .split(".")[0]; // Remove extension to get public_id

    // Cloudinary expects the full public ID (including folder)
    await cloudinary.uploader.destroy(publicIdWithFolder);
  }

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: { image: newProfilePictureUrl },
    select: {
      id: true,
      username: true,
      email: true,
      image: true, // Crucial: return the new URL
      role: true,
      isVerified: true,
    },
  });

  if (!updatedUser) {
    return next(new ApiError(500, "Failed to update profile picture."));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedUser,
        "Profile picture updated successfully.",
      ),
    );
});

const register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      return next(new ApiError(409, "User with this email already exists!")); // 409 Conflict is often used
    }
    if (existingUser.username === username) {
      return next(new ApiError(409, "Username is already taken!"));
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await db.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
  });

  if (!newUser) {
    return next(
      new ApiError(
        400,
        "Something went wrong while registering the user. Please try again.",
      ),
    );
  }
  //create verification tokens

  const { hashedToken, unHashedToken, tokenExpiry } = generateTemporaryToken();

  const UpdateUser = await db.user.update({
    where: {
      id: newUser.id,
    },
    data: {
      verificationToken: hashedToken,
      verificationTokenExpiry: tokenExpiry,
    },
    // Select only the fields needed for the next steps and response
    select: {
      id: true,
      email: true,
      username: true,
      isVerified: true, // Assuming you have an isVerified field
    },
  });

  await SendMail({
    email: newUser.email,
    subject: "Verify Your Email",
    mailGenContent: emailVerificationMailGenContent(
      newUser.username,
      `${process.env.BASE_URL}/api/v1/users/verify/${unHashedToken}`,
    ),
  });

  //generate JWT  Tokens For Auto Login

  const AccessToken = await accessToken(UpdateUser.id);
  const RefreshToken = await refreshToken(UpdateUser.id);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none", // Add this for cross-origin cookies
    path: "/", // Optional: often good to set path to root
  };

  await db.user.update({
    where: {
      id: UpdateUser.id,
    },
    data: {
      refreshToken: RefreshToken,
    },
  });

  res.cookie("AccessToken", AccessToken, cookieOptions);
  res.cookie("RefreshToken", RefreshToken, cookieOptions);

  // Prepare user data to send back to frontend
  const userDataForFrontend = {
    id: UpdateUser.id,
    email: UpdateUser.email,
    username: UpdateUser.username,
    isVerified: UpdateUser.isVerified || false,
    role: UpdateUser.role,
    image: UpdateUser.image || null, // ADD THIS LINE
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userDataForFrontend,
        "User registered and logged in successfully. Please check your email to verify your account.",
      ),
    );
});

const VerifyUser = asyncHandler(async (req, res, next) => {
  const { Incomingtoken } = req.params;

  if (!Incomingtoken) {
    return next(new ApiError(400, "Token is missing"));
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(Incomingtoken)
    .digest("hex");
  console.log(hashedToken);

  const User = await db.user.findFirst({
    where: {
      verificationToken: hashedToken,
      verificationTokenExpiry: { gt: new Date() },
    },
  });

  if (!User) {
    return next(new ApiError(400, " Invalid Token Or Token Expired"));
  }

  const UpdateUser = await db.user.update({
    where: {
      id: User.id,
    },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, UpdateUser, "User Verified Successfully"));
});

const LoginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const User = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
      isVerified: true,
      role: true,
      image: true, // ADD THIS HERE
    },
  });

  if (!User) {
    return next(new ApiError(400, "User not found"));
  }

  const isPasswordCorrect = await bcrypt.compare(password, User.password);

  if (!isPasswordCorrect) {
    return next(new ApiError(400, "Password incorrect"));
  }

  //generate tokens

  const AccessToken = await accessToken(User.id);
  const RefreshToken = await refreshToken(User.id);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none", // Add this for cross-origin cookies
    path: "/", // Optional: often good to set path to root
  };

  res.cookie("AccessToken", AccessToken, options);
  res.cookie("RefreshToken", RefreshToken, options);

  await db.user.update({
    where: {
      id: User.id,
    },
    data: {
      refreshToken: RefreshToken,
    },
  });

  // Prepare user data to send back to frontend
  const userDataForFrontend = {
    id: User.id,
    email: User.email,
    username: User.username,
    isVerified: User.isVerified || false,
    role: User.role,
    image: User.image || null,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, userDataForFrontend, "User Login SuccessFully"));
});

const LogoutUser = asyncHandler(async (req, res, _next) => {
  await db.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      refreshToken: null,
    },
  });

  res.clearCookie("AccessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
  });

  res.clearCookie("RefreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
  });

  return res.status(200).json(new ApiResponse(200, "User Logout Successfully"));
});

const ForgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const User = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!User) {
    return next(new ApiError(400, "User not found"));
  }

  const { hashedToken, unHashedToken, tokenExpiry } = generateTemporaryToken();

  await db.user.update({
    where: {
      id: User.id,
    },
    data: {
      forgetPasswordToken: hashedToken,
      forgetPasswordTokenExpiry: tokenExpiry,
    },
  });

  await SendMail({
    email: User.email,
    subject: "Reset Password",
    mailGenContent: forgetPasswordMailGenContent(
      User.username,
      `${process.env.BASE_URL}/api/v1/users/reset-pass/${unHashedToken}`,
    ),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Check Your Inbox and reset your password "));
});

const ResetPassword = asyncHandler(async (req, res, next) => {
  const { Incomingtoken } = req.params;
  const { password: newPassword } = req.body;

  if (!Incomingtoken) {
    return next(new ApiError(401, "Reset Password Token in Missing"));
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(Incomingtoken)
    .digest("hex");

  const User = await db.user.findFirst({
    where: {
      forgetPasswordToken: hashedToken,
      forgetPasswordTokenExpiry: { gt: new Date() },
    },
  });

  if (!User) {
    return next(new ApiError(400, " Invalid Token Or Token Expired"));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const UpdateUser = await db.user.update({
    where: {
      id: User.id,
    },
    data: {
      password: hashedPassword,
      forgetPasswordToken: null,
      forgetPasswordTokenExpiry: null,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, UpdateUser, "Password Reset SuccessFully"));
});

const ChangePassword = asyncHandler(async (req, res, _next) => {
  const { password: newPassword } = req.body;

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Password Change Successfully"));
});

const GetProfile = asyncHandler(async (req, res, next) => {
  const User = await db.user.findUnique({
    where: {
      id: req.user.id,
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!User) {
    return next(new ApiError(400, "Unauthorised Access"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, User, "User Profile Fetched Successfully"));
});

const ResendEmailVerification = asyncHandler(async (req, res, next) => {
  const User = await db.user.findUnique({
    where: {
      id: req.user.id,
      isVerified: false,
    },
  });

  if (!User) {
    return next(
      new ApiError(400, "Unauthorised Access or Email Veried Already!"),
    );
  }

  const { hashedToken, unHashedToken, tokenExpiry } = generateTemporaryToken();

  await db.user.update({
    where: {
      id: User.id,
    },
    data: {
      verificationToken: hashedToken,
      verificationTokenExpiry: tokenExpiry,
    },
  });

  await SendMail({
    email: User.email,
    subject: "Verify Your Email",
    mailGenContent: emailVerificationMailGenContent(
      User.username,
      `${process.env.BASE_URL}/api/v1/users/verify/${unHashedToken}`,
    ),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Successfully Resend the link Check your Inbox"),
    );
});

const RefreshAccesstoken = asyncHandler(async (req, res, next) => {
  const incomeRToken = req.cookies.RefreshToken || req.body.RefreshToken;

  if (!incomeRToken) {
    return next(new ApiError(400, "IncomingRToken is missing"));
  }

  const decodeRToken = jwt.verify(
    incomeRToken,
    process.env.REFRESH_TOKEN_SECRET,
  );

  const User = await db.user.findUnique({
    where: {
      id: decodeRToken.id,
    },
  });

  if (!User) {
    return next(new ApiError(400, "Invalid Refresh Token"));
  }

  if (incomeRToken !== User?.refreshToken) {
    return next(new ApiError(400, "Refresh Token is expired or used"));
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  const AccessToken = await accessToken(User.id);
  const RefreshToken = await refreshToken(User.id);

  res.cookie("AccessToken", AccessToken, options);
  res.cookie("RefreshToken", RefreshToken, options);

  await db.user.update({
    where: {
      id: User.id,
    },
    data: {
      refreshToken: RefreshToken,
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Acess Token SuccessFully Refreshed"));
});

export {
  register,
  VerifyUser,
  LoginUser,
  LogoutUser,
  ForgetPassword,
  ResetPassword,
  ChangePassword,
  GetProfile,
  ResendEmailVerification,
  RefreshAccesstoken,
  updateProfilePicture,
};
