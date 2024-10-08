import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
import { configDotenv } from 'dotenv';
configDotenv();
//middleware to verify token if user is logged in
export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return errorHandler(401, "Unauthorized")
    }
    console.log(process.env.JWT_SECRET)
    jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
        if (err) {
            return errorHandler(401, "Unauthorized")
        }
        req.user = userData;
        next();
    })
}