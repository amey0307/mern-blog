import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";

export const signup = async (req,res, next)=>{
    //destructuring 
    const { username, email, password } = req.body;
    console.log(req.body);

    try{
        if(!username || !email || !password || username === '' || email === '' || password === ''){
            next(errorHandler(400, "All field are Required"))
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);

        const newUser = new User({
            username,
            email,
            password:hashedPassword
        })

        await newUser.save()
        .then(()=>{
            res.json({message: "User Saved"})
        })
        .catch((err)=>{
            next(err)
        })
        
    } catch(err){
        next(err)
    }
}