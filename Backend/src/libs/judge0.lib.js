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





export {getJudge0LanguageId}