import { getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {db} from "../libs/db.js"

const executeCode=asyncHandler(async(req,res,next)=>{

    const {source_code,language_id,stdin,expected_outputs,problemId}=req.body;

    const userId=req.user.id;

    //validate test cases

    if(!Array.isArray(stdin)|| stdin.length===0 || !Array.isArray(expected_outputs)|| expected_outputs.length !== stdin.length)
    
    {
        return next(new ApiError(400,"Invalid Or missing Test cases"));
    }


    //2 prepare each testcases for judge0 batch submission

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

    //5.Analyze test Case Result

    let allPassed=true;
    const detailedResults=results.map((result,i)=>{
        const stdout=result.stdout?.trim();
        const expected_output=expected_outputs[i]?.trim();
        const passed=stdout===expected_output;

        if(!passed) allPassed=false


        return {
            testCase:i+1,
            passed,
            stdout,
            expectedOutput:expected_output,
            compileOutput:result.compile_output||null,
            stderr:result.stderr||null,
            status:result.status.description,
            memory:result.memory?`${result.memory}KB`:undefined,
            time:result.time?`${result.time}s`:undefined
        }

        // console.log(`Testcase #${i+1}`);
        // console.log(`Input ${stdin[i]}`);
        // console.log(`Expected Output for testcase ${expected_output}`);
        // console.log(`Actual Output ${stdout}`);
        // console.log(`Matched : ${passed}`);
        // console.log(detailedResults);

    })


    //6.Store Submission Summary

    const submission = await db.submission.create({
        data:{
            userId,
            problemId,
            sourceCode:source_code,
            language:getLanguageName(language_id),
            stdin:stdin.join("\n"),
            stdout:JSON.stringify(detailedResults.map((r)=>r.stdout)),
            stderr:detailedResults.some((r)=>r.stderr) ? JSON.stringify(detailedResults.map((r)=>r.stderr)):null,
            compileOutput:detailedResults.some((r)=>r.compileOutput) ? JSON.stringify(detailedResults.map((r)=>r.compileOutput)):null,
            status:allPassed? "Accepted":"Wrong Answer",
            memory:detailedResults.some((r)=>r.memory) ? JSON.stringify(detailedResults.map((r)=>r.memory)):null,
            time:detailedResults.some((r)=>r.time) ? JSON.stringify(detailedResults.map((r)=>r.time)):null

        }
    })


    // 7.If all passed= true mark problem as solved for the current user

    if(allPassed){
        await db.problemSolved.upsert({
            where:{
                userId_problemId:{
                    userId,problemId
                }
            },
            update:{},
            create:{
                userId,problemId
            }
        })
    }

    // 8. save individualt testcase Results using detailed Results

    const testcaseResults=detailedResults.map((result)=>({
        submissionId:submission.id,
        testCase:result.testCase,
        passed:result.passed,
        stdout:result.stdout,
        expectedOutput:result.expectedOutput,
        stderr:result.stderr,
        compileOutput:result.compile_output,
        status: result.status,
        memory:result.memory,
        time:result.time
    }))

    await db.testCaseResult.createMany({
        data:testcaseResults
    })

    const submissionWithTestcase=await db.submission.findUnique({
        where:{
            id:submission.id
        },
        include:{
            testcases:true
        }
    })
    return res
    .status(200)
    .json(new ApiResponse(200,"code Executed",submissionWithTestcase));
})


export {executeCode};