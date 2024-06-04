import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'

const generateRandomPassword = () => {
    const length = 8; // minimum password length
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    return password;
};

export const signup = async (req, res, next) => {
    //destructuring 
    const { username, email, password } = req.body;
    console.log(req.body);

    try {
        if (!username || !email || !password || username === '' || email === '' || password === '') {
            next(errorHandler(400, "All field are Required"))
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        await newUser.save()
            .then(() => {
                res
                .status(200)
                .json({
                    success: true,
                    message: "User Saved"
                })
            })
            .catch((err) => {
                next(err)
            })

    } catch (err) {
        next(err)
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {

        if (!email || !password || email === '' || password === '') {
            next(errorHandler(400, "Fill all the field"));
        }

        const validUser = await User.findOne({ email });
        // console.log(validUser);


        if (!validUser) {
            return next(errorHandler(404, "User Not Found"));
            console.log("User Not Found")
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password); //comaping the password
        if (!validPassword) {
            return next(errorHandler(400, "Wrong Credientials (password)"))
            console.log("Wrong Credientials (password)")
        }

        console.log(`Access Granted to ${validUser.username}`)
        //Now that both the email and password is correct we need to authenticate the user
        //for that we will be using Json Web Token (JWT)

        //remove passwrd to send to client side
        const { password: pass, ...rest } = validUser._doc;

        //This will create a token for a valid user
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        res.status(200).cookie('access_token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000
        }).json({
            message: "Sign In Successfull",
            userInfo: rest,
        })

    } catch (e) {
        next(e);
    }
}

export const google = async (req, res, next) => {
    const { username, email, photo } = req.body;

    try {
        const validUser = await User.findOne({ email });

        if (validUser) {
            const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET); //create a token
            const { password, ...rest } = validUser._doc; //to remove password to be sent to client side
            res.status(200).cookie('access_token', token, { httpOnly: true }).json({
                message: "Sign In Successfull",
                userInfo: rest
            }) //send a cookie as a response with json
        }
        else{
            const generatedPassword = generateRandomPassword();
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new User({
                username : username.toLowerCase().split(" ").join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: photo
            })
    
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc; //to remove password to be sent to client side
            res.status(200).cookie('access_token', token, { httpOnly: true }).json({
                message: "User Successfully Created",
                userInfo: rest
            }) //send a cookie as a response with json


        }

    } catch (e) {
        next(401, e);
    }
}