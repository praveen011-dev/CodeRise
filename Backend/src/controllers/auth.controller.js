import { asyncHandler } from "../utils/asyncHandler.js";
import { db } from "../libs/db.js";
import bcrypt from "bcrypt"
import {ApiError} from "../utils/api.error.js"
import {ApiResponse} from "../utils/api.response.js"
import { generateTemporaryToken } from "../mail/generateTempToken.js";
import { SendMail,emailVerificationMailGenContent } from "../mail/mail.js";

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
    console.log(hashedPassword);

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

    const hashedToken=crypto.createHash("sha256").update(Incomingtoken).digest("hex")

    const User=await db.user.findfirst({
        where:{
            verificationToken:hashedToken,
            verificationTokenExpiry :{gt:new Date()}
        }
    })   

    if(!User){
        return next(new ApiError(400,"User not Found"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200,"User Verified Successfully"));


})




export {register,VerifyUser}
