import axios from "axios"
import dotenv from "dotenv"

dotenv.config();

const getJudge0LanguageId=(language)=>{
    const LanguageMap={
        JAVA:62,
        JAVASCRIPT:63,
        PYTHON:71
    }
    return LanguageMap[language.toUpperCase()]
}


const sleep=(time)=> new Promise((resolve)=>{
    setTimeout(resolve,time)
})




const submitBatch=async(submissions)=>{
    const {data}=await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{submissions});

    console.log("Submission Batch:", data)
    return data //[{token},{token},{token}]
}


// on first submission we get array of tokens from judge0



const pollBatchResults=async(Tokens)=>{
while(true)
{
    const {data}=await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
        params:{
            tokens:Tokens.join(","),
            base64_encoded:false,
        }
    })
        
        const results=data.submissions

        const isAllSubmitted=results.every(
              (result)=>result.status.id!== 1 && result.status.id!==2
        )


        if(isAllSubmitted) return results
        await sleep(1000);

       
    }
}




export {getJudge0LanguageId,submitBatch,pollBatchResults}