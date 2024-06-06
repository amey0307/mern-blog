import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";

export const createPost = async (req, res, next) => {
    console.log(req.body);
    if(!req.user.isAdmin){
        return next(errorHandler(401, "Unauthorized"))
    }

    if(!req.body.title || !req.body.content || !req.body.category){
        return next(errorHandler(400, "Please fill in all fields"))
    }

    const slug = req.body.title.toLowerCase().split(' ').join('-').replace(/[^a-zA-Z0-9 -]/g, "");

    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user._id,
        photo: req.body.profilePicture
    })

    try{
        const savedPost = await newPost.save();
        res.status(201).json(savedPost)
    }catch(e){
        return next(errorHandler(500, e.message))
    }
}