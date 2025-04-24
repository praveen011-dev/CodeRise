import { asyncHandler } from "../utils/asyncHandler.js";
import { db } from "../libs/db.js";
import bcrypt from "bcryptjs"
import {ApiError} from "../utils/api.error.js"

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
})


export {register}
