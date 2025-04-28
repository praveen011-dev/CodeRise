import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { ApiError } from "../utils/api.error.js";
import { db } from "../libs/db.js";


dotenv.config();

const isLoggedIn=asyncHandler(async(req,_res,next)=>{
        const {AccessToken}=req.cookies

        if(!AccessToken){
            return next(new ApiError(400,"token is missing"))
        }

        const decodedData= jwt.verify(AccessToken,process.env.ACCESS_TOKEN_SECRET)

        const User= await db.user.findUnique({
            where:{
                email:decodedData.email
            }
        })

        if(!User){
            return next(new ApiError(400,"Invalid Access Token "))
        }

        req.user=User
        next();

})



const isAdmin=asyncHandler(async(req,res,next)=>{

    const userId=req.user.id 

    const User=await db.user.findUnique({
        where:{
            id:userId
        },
        select:{
            role:true
        }
    })

    if(User.role !=="ADMIN"){
        return next (new ApiError(403,"Access denied!- Admin only"))
    }
    next();
})




export {isLoggedIn,isAdmin}