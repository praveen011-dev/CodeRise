import { RegisterUserSchema,LoginUserSchema } from "../validation/user.validation.js";


const validateRegisterUser=(req,_res,next)=>{
    const result= RegisterUserSchema.safeParse(req.body);
    console.log(result);
    next();
}

const validateLoginUser=(req,_res,next)=>{
    const result= LoginUserSchema.safeParse(req.body);
    console.log(result);
    next();
}

export {validateRegisterUser,validateLoginUser}