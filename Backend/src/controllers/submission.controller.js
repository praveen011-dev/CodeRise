import { asyncHandler } from "../utils/asyncHandler.js";

const getAllSubmission=asyncHandler(async(req,res,next)=>{

    const userId=req.user.id;

    const submission=await db.submission.findMany({
        where:{
            userId
        }
    })

    if(!submission){
        return next(new ApiError(404,"No Submission found"));
    }
    return res
    .status(200)
    .json(new ApiResponse(200,submission,"Submission Found"));
})

const getSubmissionForProblem=asyncHandler(async(req,res,next)=>{

    const userId=req.user.id;
    const problemId=req.params.problemId;   

    const submission=await db.submission.findMany({
        where:{
            userId,
            problemId
        }
    })

    if(!submission){
        return next(new ApiError(404,"No Submission found"));
    }
    return res
    .status(200)
    .json(new ApiResponse(200,submission,"Submission Found"));

})

const getSubmissionCountForProblem=asyncHandler(async(req,res,next)=>{
    const problemId=req.params.problemId;   
    const submission=await db.submission.count({
        where:{
            problemId
        }
    })

    if(!submission){
        return next(new ApiError(404,"No Submission found"));
    }
    return res
    .status(200)
    .json(new ApiResponse(200,submission,"Submission Count Found"));

})


export {getAllSubmission,getSubmissionForProblem,getSubmissionCountForProblem}