import { asyncHandler } from "../utils/asyncHandler.js";
import { db } from "../libs/db.js";
import bcrypt from "bcryptjs"
import {ApiError} from "../utils/api.error.js"
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

    const newUser=await db.user.create({
        data:{
            email,
            username,
            password:hashedPassword
        }
   
})
//create token

const {hashedToken,unHashedToken,tokenExpiry}=generateTemporaryToken();

newUser.verificationToken=hashedToken
newUser.verificationTokenExpiry=tokenExpiry

await SendMail({
    email: user.email,
    subject: "Verify Your Email",
    mailGenContent: emailVerificationMailGenContent(
      user.username,
      `${process.env.BASE_URL}/api/v1/users/verify/${unHashedToken}`,
    ),
  });

})


export {register}
