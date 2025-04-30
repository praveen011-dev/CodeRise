import { getJudge0LanguageId, pollBatchResults } from "../libs/judge0.lib.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api.error.js";

const createProblem=asyncHandler(async(req,res,next)=>{

    const {title,description,difficulty,tags,examples,constraints,testcases,codeSnippet,refrenceSolution}=req.body

    //loop through each refrence solution for different languaes 
    for(const [language,solutionCode] of Object.entries(refrenceSolution)){

        const langaugeId= getJudge0LanguageId(language);

        if(!langaugeId){
            return next (new ApiError(400,"Invalid Language"))
        }

        const submissions=testcases.map(({input,output})=>{
            return {
                source_code:solutionCode,
                language_id:langaugeId,
                stdin:input,
                expected:output
            }
        })

        const submissionResults=await submitBatch(submissions)

        const Tokens=submissionResults.map((res)=>res.token);

        const results=await pollBatchResults(Tokens);

        for(let i=0;i<results.length;i++){
            const result = results[i];

            if(result.status!=="3"){
                return next(new ApiError(400,"Test case failed"));
            }
        }

        //save the problem to the database

        const newProblem= await db.problem.create({
            data:{
                title,
                description,
                difficulty,
                tags,
                userId:req.user.id,
                examples,
                constraints,
                hints,
                editorial,
                testcases,
                codeSnippet,
                refrenceSolution
            } 
        })
 
        return res
        .status(201)
        .json(new ApiResponse(201,newProblem,"problem created successfully"));
    }

    })

const getAllProblems=asyncHandler(async(req,res,next)=>{

})

const getProblemById=asyncHandler(async(req,res,next)=>{

})

const updateProblem=asyncHandler(async(req,res,next)=>{

})

const deleteProblem=asyncHandler(async(req,res,next)=>{

})
const getProblemSolvedByUser=asyncHandler(async(req,res,next)=>{

})



export {createProblem,getAllProblems,getProblemById,updateProblem,deleteProblem,getProblemSolvedByUser}