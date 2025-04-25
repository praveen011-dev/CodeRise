import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { ApiError } from "../utils/api.error.js";
import { db } from "../libs/db.js";


dotenv.config();

const isLoggedIn=asyncHandler(async(req,_res,next)=>{
        const {Logintoken}=req.cookies
        if(!Logintoken){
            return next(new ApiError(400,"Login token is missing"))
        }

        const decodedData= jwt.verify(Logintoken,process.env.JWT_SECRET)

        const User= await db.user.findUnique({
            where:{
                email:decodedData.email
            }
        })

        if(!User){
            return next(new ApiError(400,"User not Found"))
        }

        req.user=User
        next();

})


export {isLoggedIn}