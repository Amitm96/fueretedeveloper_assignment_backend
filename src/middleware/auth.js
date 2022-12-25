const jwt = require("jsonwebtoken");

async function verifyUser(req , res , next){
    try{
        let token = req.headers.token
        if(!token || !token.trim()){
            return res.status(401).send({status : false , msg : "authentication failed provide token"})
        }
        jwt.verify(token , "fdevasssignprjctseckey" , (err , decodetoken)=>{
            if(err){
                return res.status(401).send({status : false , msg : "token is not valid"})
            }
            req.userId = decodetoken.userId
            next();
        })
    }
    catch(err){
        return res.status(500).send({status : false , msg : err.message})
    }
}

module.exports = {verifyUser}