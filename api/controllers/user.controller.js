import User from "../models/user.model.js";
import {errorHandler} from '../utils/error.js';
import bcryptjs from 'bcryptjs';

export const test = (req,res)=>{
    res.json({name: "Api is working"});
}

export const updateUser = async (req,res,next)=>{

    if(req.user.id !== req.params.userId){
        return next(errorHandler(401, "Unauthorized"))
    }

    if(!req.body.password && (req.body.newPassword || req.body.rePassword)){
        return next(errorHandler(400, "Password is required"))
    }

    if((req.body.newPassword || req.body.rePassword) && (req.body.newPassword != req.body.rePassword)){
        return next(errorHandler(400, "Passwords do not match"))
    }

    if(req.body.newPassword){
        const hashedPassword = bcryptjs.hashSync(req.body.newPassword, 10)
        console.log(hashedPassword);
        req.body.newPassword = hashedPassword;
    }
    try{

        const updateUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.newPassword,
            },
        },
        {new: true} 
        )

        const {password, ...rest} = updateUser._doc;
        res.json(rest);
    }catch(e){
        return next(errorHandler(500, e.message))
    }
}

