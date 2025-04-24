import crypto from "crypto"


const generateTemporaryToken=function(){
    const unHashedToken= crypto.randomBytes(20).toString("hex");
    const hashedToken=crypto.createHash("sha256").update(unHashedToken).digest("hex")
    const tokenExpiry=new Date(Date.now() + 20 * 60 * 1000);
    
    return {hashedToken,unHashedToken,tokenExpiry}
}

export {generateTemporaryToken}