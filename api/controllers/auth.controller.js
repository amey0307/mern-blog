import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    //destructuring 
    const { username, email, password, profilePicture } = req.body;

    try {
        if (!username || !email || !password || username === '' || email === '' || password === '') {
            next(errorHandler(400, "All field are Required"))
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            profilePicture
        })

        await newUser.save()
            .then(() => {
                const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
                const { password, ...rest } = newUser._doc;
                res
                    .status(200)
                    .cookie('access_token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 })
                    .json(rest)
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
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password); //comaping the password
        if (!validPassword) {
            return next(errorHandler(400, "Wrong Credientials (password)"))
        }

        console.log(`Access Granted to ${validUser.username}`)
        //Now that both the email and password is correct we need to authenticate the user
        //for that we will be using Json Web Token (JWT)

        //remove passwrd to send to client side
        const { password: pass, ...rest } = validUser._doc;

        //This will create a token for a valid user
        const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);
        res.status(200).cookie('access_token', token, {
            httpOnly: true,
            // maxAge: 60 * 60 * 1000
        }).json(rest)

    } catch (e) {
        next(e);
    }
}

export const google = async (req, res, next) => {
    const { name, email, googlePhotoUrl } = req.body;

    try {
        const validUser = await User.findOne({ email });

        if (validUser) {
            const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET); //create a token
            const { password, ...rest } = validUser._doc; //to remove password to be sent to client side
            res.status(200).cookie('access_token', token, { httpOnly: true }).json(rest) //send a cookie as a response with json
        }
        else {
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') +
                    Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl
            })

            await newUser.save();
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc; //to remove password to be sent to client side
            res.status(200).cookie('access_token', token, { httpOnly: true }).json(rest) //send a cookie as a response with json


        }

    } catch (e) {
        next(e);
    }
}

export const google1 = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin },
                process.env.JWT_SECRET
            );
            const { password, ...rest } = user._doc;
            res
                .status(200)
                .cookie('access_token', token, {
                    httpOnly: true,
                })
                .json(rest);
        } else {
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username:
                    name.toLowerCase().split(' ').join('') +
                    Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });
            await newUser.save();
            const token = jwt.sign(
                { id: newUser._id, isAdmin: newUser.isAdmin },
                process.env.JWT_SECRET
            );
            const { password, ...rest } = newUser._doc;
            res
                .status(200)
                .cookie('access_token', token, {
                    httpOnly: true,
                })
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
};