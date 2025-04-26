import { db } from "../libs/db.js";
import dotenv from"dotenv"
import jwt from "jsonwebtoken"

dotenv.config();

const accessToken=async(id)=>{
    const User=await db.user.findUnique({
        where:{
            id
        }
    })
    return jwt.sign({
        id: User.id,           
        email: User.email,
        username: User.username
    },process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:process.env.ACCESS_TOKEN_EXPIRY})

}




export {accessToken}