import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api.error.js";
import {ApiResponse} from "../utils/api.response.js"
import {db} from "../libs/db.js"

const createProblem=asyncHandler(async(req,res,next)=>{

    const {title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippet,
        refrenceSolution
        }=req.body

        if (req.user.role !== "ADMIN") {
            return next(new ApiError(403, "Access Denied!"));
          }


    //loop through each refrence solution for different languaes 
    
            
    for(const [language,solutionCode] of Object.entries(refrenceSolution)){
            try{
                const languageId= getJudge0LanguageId(language);
        
                console.log(`Language: ${language}, Language ID: ${languageId}`);
        
                if(!languageId){
                    return next (new ApiError(400,`Invalid Language ${language}`))
                }
        
        
                const submissions=testcases.map(({input,output})=>{
                    return {
                        source_code:solutionCode,
                        language_id:languageId,
                        stdin:input,
                        expected:output
                    }
                })


                const submissionResults=await submitBatch(submissions)
                const Tokens=submissionResults.map((res)=>res.token);    
                const results=await pollBatchResults(Tokens);
        
                for(let i=0;i<results.length;i++){
                    const result = results[i];
                    console.log("Result-----",result)
                    if(result.status.id!==3){
                        return next(new ApiError(400,"Test case failed"));
                    }
                }
            }
            catch (error) {
                return next(new ApiError(500, "Error while creating a problem"));
        
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
                        testcases,
                        codeSnippet,
                        refrenceSolution
                    } 
                })
            
                return res
                .status(201)
                .json(new ApiResponse(201,newProblem,"problem created successfully"));
            })

const getAllProblems=asyncHandler(async(req,res,next)=>{

    const allproblems=await db.problem.findMany();

    if(!allproblems){
        return next (new ApiError(400,"No problems found"));
    }

    return res
    .status(200)
    .json(new ApiResponse(200,allproblems,"Problems Found SuccessFully"));

})

const getProblemById=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;

    const problemById=await db.problem.findUnique({
        where:{
            id
        }
    })
    if(!problemById){
        return next(new ApiError(404,"Problem not found"));
    }

    return res
    .status(200)
    .json(new ApiResponse(200,problemById,"Problem Found Successfully"));
})

const updateProblem=asyncHandler(async(req,res,next)=>{
    const {id}=req.params

    const {title,description,difficulty,tags,examples,constraints,testcases,codeSnippet,refrenceSolution}=req.body

    for(const [language,solutionCode] of Object.entries(refrenceSolution)){

        const languageId = getJudge0LanguageId(language);

        if(!langaugeId){
            return next (new ApiError(400,`Invalid Language ${language}`))
        }

        const submissions=testcases.map(({input,output})=>{
            return {
                source_code:solutionCode,
                language_id:languageId,
                stdin:input,
                expected:output
            }
        })

        const submissionResults=await submitBatch(submissions)

        const Tokens=submissionResults.map((res)=>res.token);

        const results=await pollBatchResults(Tokens);

        for(let i=0;i<results.length;i++){
            const result = results[i];
            console.log("Result-----",result)
            if(result.status.id!==3){
                return next(new ApiError(400,"Test case failed"));
            }
        }
    }
    const Problem = await prisma.problem.findUnique({
        where: { id }
      });

    const updateProblem=await db.problem.update({
        where:{
            id,
            userId:req.user.id
        },
        data:{
            title: title ?? Problem.title,
            description:description??Problem.description,
            difficulty:difficulty??Problem.difficulty,
            tags:tags??Problem.tags,
            examples:examples??Problem.examples,
            constraints:constraints??Problem.constraints,
            testcases:testcases??Problem.testcases,
            codeSnippet:codeSnippet??Problem.codeSnippet,
            refrenceSolution:refrenceSolution??Problem.refrenceSolution
        }
    })

    if(!updateProblem){
        return next(new ApiError(404,"error while Updating Or Problem not found"));
    }
    return res
    .status(200)
    .json(new ApiResponse(200,updateProblem,"Problem Updated Successfully"));

})


const deleteProblem=asyncHandler(async(req,res,next)=>{

    const {id}=req.params
    const deleteProblem=await db.problem.delete({
        where:{
            id,
            userId:req.user.id
        }   
    })

    if(!deleteProblem){
        return next(new ApiError(404,"error while Deletin Or Problem not found"));
    }
    return res
    .status(200)
    .json(new ApiResponse(200,"Problem Deleted Successfully"));

})


const getProblemSolvedByUser=asyncHandler(async(req,res,next)=>{

})



export {createProblem,getAllProblems,getProblemById,updateProblem,deleteProblem,getProblemSolvedByUser}