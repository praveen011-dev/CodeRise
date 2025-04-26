import {z} from "zod"

const RegisterUserSchema=z.object({
    username:z
            .string({
                    required_error: "Name is required",
                    invalid_type_error: "Name must be a string"
                    })
            .trim()
            .min(5,"Username must  be atleast 5 character")
            .max(20,"Username must be no more than 20 Characters"),

    email: z.string({
                    required_error: "Email is required",
                    invalid_type_error: "Email must be a string"
                    })
            .trim()
            .email("Must be a valid email"),
    
    password:z.string({
                    required_error: "Password is required",
                    invalid_type_error: "Password must be a string"
                     })
             .min(6,{message:"Password must be atleast 6 character"}) 
        
})



const LoginUserSchema=z.object({
    email: z.string({
                    required_error: "Email is required",
                    invalid_type_error: "Email must be a string"
                    })
            .trim()
            .email("Must be a valid email"),

    password:z.string({
                    required_error: "Password is required",
                    invalid_type_error: "Password must be a string"
                    })
})


const ForgetPassSchema=z.object({
        email: z.string({
                        required_error: "Email is required",
                        invalid_type_error: "Email must be a string"
                        })
                .email("Must be a valid email"),
    
    })


const ResetPassSchema=z.object({
        password:z.string({
                required_error: "Enter New password !",
                invalid_type_error: "Password must be a string"
                })
    
    })
    

const ChangeCurrPassSchema = z.object({
password: z.string({
        required_error: "Enter New password!",
        invalid_type_error: "Password must be a string",
}).nonempty("Password cannot be empty!"),

});
      


export {RegisterUserSchema,LoginUserSchema,ForgetPassSchema,ResetPassSchema,ChangeCurrPassSchema}