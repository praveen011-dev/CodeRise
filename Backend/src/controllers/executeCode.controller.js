import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const executeCode=asyncHandler(async(req,res,next)=>{

    const {source_code,language_id,stdin, expected_outputs,problem_id}=req.body;

    const userId=req.user.id;

    //validate test cases

    if(!Array.isArray(stdin)|| stdin.length===0 || !Array.isArray(expected_outputs)|| expected_outputs.length !== stdin.length)
    
    {
        return next(new ApiError(400,"Invalid Or missing Test cases"));
    }


    //2 prepare each test cases for judge0 batch submission

    const submissions =stdin.map((input)=>({
        source_code,
        language_id,
        stdin:input
    }))


    //3. Send this batch of submission to judge0

    const submitResponse= await submitBatch(submissions);
    const tokens =submitResponse.map((res)=>res.token);

    //4. poll judge0 for results of all submitted test cases

    const results =await pollBatchResults(tokens);

    console.log("Results----------------")
    console.log(results);

    return res
    .status(200)
    .json(new ApiResponse(200,"code Executed"));
})


export {executeCode};