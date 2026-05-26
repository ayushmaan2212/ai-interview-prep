const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const TokenBlacklistModel = require("../models/blacklist.model");


async function authUser(req,res,next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ message: "Unauthorized" });
    }

    const isTokenBlackListed = await TokenBlacklistModel.findOne({ token });

    if(isTokenBlackListed){
        return res.status(401).json({ message: "Unauthorized" });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    }catch(err){
        return res.status(401).json({ message: "Invalid token" });
    }
        
}

module.exports = {
    authUser
};