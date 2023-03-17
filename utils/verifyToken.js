import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.jwttoken;

    
    if(!token){
        return next(createError(401, "you are not authenticated!!"))
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if(err){
            return next(createError(403, "Token is not valid!!"))
        }
        req.currUser = user
        next()
    })
}

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, next,() => {
        if(req.currUser.id === req.params.id || req.currUser.isAdmin){
            next()
        }
        else{
            return next(createError(403, "you are not authorized User!!"))
        }
    })
}

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res ,next , () => {
        if(req.currUser.isAdmin){
            next()
        }
        else{
            return next(createError(403, "you are not Admin!!"))
        }
    })
}