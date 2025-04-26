import { asyncHandler } from "../utils/asyncHandler.js";
import { db } from "../libs/db.js";
import dotenv from "dotenv"
import crypto from "crypto"
import bcrypt from "bcrypt"
import {ApiError} from "../utils/api.error.js"
import {ApiResponse} from "../utils/api.response.js"
import { generateTemporaryToken } from "../mail/generateTempToken.js";
import { SendMail,emailVerificationMailGenContent } from "../mail/mail.js";
import { accessToken,refreshToken} from "../Access&RefreshToken/AccessToken&RefreshToken.js";

dotenv.config();

const register=asyncHandler(async(req,res,next)=>{

    const {username,email,password}=req.body

    const existingUser=await db.user.findUnique({
        where:{
            email
        }
    })

    if(existingUser){
        return next(new ApiError(400,"User Already Exist!"))
    }
    
    const hashedPassword=await bcrypt.hash(password,10);

    const newUser=await db.user.create({
        data:{
            email,
            username,
            password:hashedPassword
            }
        })

    if (!newUser) {
        return next(new ApiError(400, "Something Wrong User not register"));
    }
//create token

const {hashedToken,unHashedToken,tokenExpiry}=generateTemporaryToken();

const UpdateUser=await db.user.update({
    where:{
        id:newUser.id
    },
    data:{
        verificationToken:hashedToken,
        verificationTokenExpiry:tokenExpiry
    }
})

await SendMail({
    email: newUser.email,
    subject: "Verify Your Email",
    mailGenContent: emailVerificationMailGenContent(
      newUser.username,
      `${process.env.BASE_URL}/api/v1/users/verify/${unHashedToken}`,
    ),
  });

  return res
  .status(200)
  .json(new ApiResponse(200,
            {
                id:UpdateUser.id,
                email:UpdateUser.email,
                username:UpdateUser.username,
                verificationToken:UpdateUser.verificationToken,
                verificationTokenExpiry:UpdateUser.verificationTokenExpiry
            },
            "User Registered Successfully"
            ))



})


const VerifyUser=asyncHandler(async(req,res,next)=>{

    const {Incomingtoken}=req.params

    if(!Incomingtoken){
        return next(new ApiError(400,"Token is missing"));
    }

    console.log("hello");
    const hashedToken=crypto.createHash("sha256").update(Incomingtoken).digest("hex")
    console.log(hashedToken)

    const User=await db.user.findFirst({
        where:{
            verificationToken:hashedToken,
            verificationTokenExpiry :{gt:new Date()}
        }
    })   

    if(!User){
        return next(new ApiError(400,"User not Found Or Token Expire"))
    }

    const UpdateUser=await db.user.update({
        where:{
            id:User.id
        },
        data:{
            isVerified:true,
            verificationToken:undefined,
            verificationTokenExpiry:undefined
        }
    })

    return res
    .status(200)
    .json(new ApiResponse(200,UpdateUser,"User Verified Successfully"));



})


const LoginUser=asyncHandler(async(req,res,next)=>{

    const {email,password}=req.body

    const User=await db.user.findUnique({
        where:{
            email
        }
    })

    if(!User){
        return next(new ApiError(400,"User not found"))
    }

    const isPasswordCorrect =await bcrypt.compare(password,User.password)

    if(!isPasswordCorrect){
        return next(new ApiError(400,"Password incorrect"))
    }

    //generate tokens

    const AccessToken=await accessToken(User.id);
    const RefreshToken=await refreshToken(User.id);

    const options={
        httpOnly:true,
        secure:true,
    }

    res.cookie("AccessToken",AccessToken,options)
    res.cookie("RefreshToken",RefreshToken,options)

        return res
        .status(200)
        .json(new ApiResponse(200,"User Login SuccessFully"))
})


const LogoutUser=asyncHandler(async(_req,res,_next)=>{
    res.clearCookie("LoginToken", {
        httpOnly: true,  
        secure:  process.env.NODE_ENV !== "development"
      });

      return res
      .status(200)
      .json(new ApiResponse(200,"User Logout Successfully"))
})


export {register,VerifyUser,LoginUser,LogoutUser}
