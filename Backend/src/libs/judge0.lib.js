import axios from "axios"
import dotenv from "dotenv"

dotenv.config();

const getJudge0LanguageId=(language)=>{
    const LanguageMap={
        "JAVA":62,
        "JAVASCRIPT":63,
        "PYTHON":70
    }
    return LanguageMap[language.toUpperCase()]
}


const submitBatch=async(submissions)=>{
    const {data}=await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{submissions});

    console.log(`Submission Batch: ${data}`)
    return data //[{token},{token},{token}]
}


// on first submission we get tokens from judge0



export {getJudge0LanguageId,submitBatch}