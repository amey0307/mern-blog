import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'

export const signup = async (req,res)=>{
    //destructuring 
    const { username, email, password } = req.body;
    console.log(req.body);

    try{
        if(!username || !email || !password || username === '' || email === '' || password === ''){
            return res.status(400).json({message: "All field are required"});
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
            res.json({
                message: "Something Went wrong",
                error: err.message
            })
        })
        
    } catch(err){
        console.log(err);
    }
}