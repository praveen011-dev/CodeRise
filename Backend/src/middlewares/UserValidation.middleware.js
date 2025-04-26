import { RegisterUserSchema,LoginUserSchema, ForgetPassSchema } from "../validation/user.validation.js";
import { ApiError } from "../utils/api.error.js";

const validateRegisterUser=(req,_res,next)=>{
    const result= RegisterUserSchema.safeParse(req.body);

    if(!result.success) {
        return next(new ApiError(400,"Validation failed",result.error.issues[0].message));
      }
      next();
    };

const validateLoginUser=(req,_res,next)=>{
    const result= LoginUserSchema.safeParse(req.body);
    if(!result.success) {
        return next(new ApiError(
            400,"Validation failed",result.error.issues[0].message));
                        }
      next();
    }; 


    const validateForgetPass=(req,_res,next)=>{
        const result=ForgetPassSchema.safeParse(req.body);
        if(!result.success) {
            return next(new ApiError(
                400,"Validation failed",result.error.issues[0].message));
                            }
          next();
        }; 

export {validateRegisterUser,validateLoginUser,validateForgetPass}