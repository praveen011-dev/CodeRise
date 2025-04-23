import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheck=asyncHandler(async(_req,res)=>{
    res.send("Everything is perfect and running smoothly");

});

export {healthCheck};